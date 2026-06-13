# DevOps Projet - Lucas & Riyad

Projet d'infrastructure et déploiement — 4e année EFREI.

On déploie une app TanStack Start (full-stack SSR) sur 2 EC2 derrière un ALB, avec RDS PostgreSQL, Cognito pour l'auth, S3 pour les assets et backups, le tout provisionné en Terraform, configuré avec Ansible et livré en CI/CD via GitHub Actions. HTTPS via DuckDNS + certificat ACM (gratuit).

---

## Table des matières

- [Pré-requis](#pr%C3%A9-requis)
- [Architecture](#architecture)
- [Schéma réseau et flux](#sch%C3%A9ma-r%C3%A9seau-et-flux)
- [Déploiement from scratch](#d%C3%A9ploiement-from-scratch)
- [Terraform](#terraform)
- [Ansible](#ansible)
- [Molecule - Tester les rôles Ansible](#molecule---tester-les-r%C3%B4les-ansible)
- [CI/CD - GitHub Actions](#cicd---github-actions)
- [Stratégie de backup](#strat%C3%A9gie-de-backup)
- [Restauration (bonus)](#restauration-bonus)
- [Usine logicielle (bonus)](#usine-logicielle-bonus)
- [Sécurité](#s%C3%A9curit%C3%A9)
- [Structure du repo](#structure-du-repo)
- [Galères rencontrées](#gal%C3%A8res-rencontr%C3%A9es)

---

## Pré-requis

- **AWS account** avec les permissions pour créer VPC, EC2, RDS, ALB, S3, Cognito, ECR
- **Terraform** ≥ 1.6
- **Ansible** ≥ 2.15
- **Python 3** + `molecule` et `docker` (pour les tests)
- **AWS CLI** configuré (`aws configure` ou `aws sso login`)
- **SSM Plugin** pour AWS Session Manager (connection Ansible via SSM)
- **Docker** (pour les tests Molecule et les builds locaux)
- **Node.js** ≥ 20 (pour l'application)

---

## Architecture

```
                          Internet
                             |
                       [DuckDNS]
                    app-lucas.duckdns.org
                             |
                           [ALB] (port 443 HTTPS → redirige 80→443)
                         /        \
                   [EC2 app]    [EC2 app]        ← N=2, port 3000, Docker
                        |            |
                        +-----+------+
                              |
                          [RDS PostgreSQL]   ← port 5432, subnet privé
                              |
                     [S3 backups] (pg_dump quotidien, rétention 7j)

  [Cognito]                    ← auth gérée par AWS
  [S3 assets]                  ← uploads de l'application
  [ECR]                        ← registry Docker
  [DuckDNS]                    ← DNS gratuit : app-lucas.duckdns.org
```

### Détail des machines

| Machine        | Type          | Rôle                                       | Ports ouverts             | Accès depuis               |
| -------------- | ------------- | ------------------------------------------ | ------------------------- | -------------------------- |
| EC2 app 1      | `t3.micro`    | Application (TanStack Start dans Docker)   | 3000 (SG ALB), 22 (admin) | ALB seulement pour le 3000 |
| EC2 app 2      | `t3.micro`    | Application (TanStack Start dans Docker)   | 3000 (SG ALB), 22 (admin) | ALB seulement pour le 3000 |
| RDS PostgreSQL | `db.t3.micro` | Base de données                            | 5432 (SG app)             | EC2 app seulement          |
| ALB            | -             | Load balancer HTTPS, terminaison TLS       | 443, 80                   | 0.0.0.0/0                  |
| S3 assets      | -             | Stockage fichiers uploadés                 | -                         | EC2 app (via IAM role)     |
| S3 backups     | -             | Stockage des backups BDD                   | -                         | EC2 app (via IAM role)     |
| Cognito        | -             | Auth utilisateurs (User Pool + App Client) | -                         | Application                |
| ECR            | -             | Registry d'images Docker                   | -                         | GitHub Actions + EC2       |

### Schéma réseau

```
┌─────────────────────────────────────────────────────────────┐
│                        VPC (10.0.0.0/16)                     │
│                                                              │
│  ┌─────────────────────┐    ┌─────────────────────┐         │
│  │  Subnet public A    │    │  Subnet public B    │         │
│  │  10.0.1.0/24        │    │  10.0.2.0/24        │         │
│  │  eu-west-3a         │    │  eu-west-3b         │         │
│  │                     │    │                     │         │
│  │  ┌──────┐ ┌──────┐  │    │  ┌──────┐ ┌──────┐  │         │
│  │  │EC2   │ │ALB   │  │    │  │EC2   │ │ALB   │  │         │
│  │  │app 1 │ │(AZ A)│  │    │  │app 2 │ │(AZ B)│  │         │
│  │  └──────┘ └──────┘  │    │  └──────┘ └──────┘  │         │
│  └─────────────────────┘    └─────────────────────┘         │
│                                                              │
│  ┌─────────────────────┐    ┌─────────────────────┐         │
│  │  Subnet privé A     │    │  Subnet privé B     │         │
│  │  10.0.11.0/24       │    │  10.0.12.0/24       │         │
│  │  eu-west-3a         │    │  eu-west-3b         │         │
│  │                     │    │                     │         │
│  │     ┌─────────┐     │    │     ┌─────────┐     │         │
│  │     │  RDS    │─────┼────┼─────│  RDS    │     │         │
│  │     │(AZ A)   │     │    │     │(AZ B)   │     │         │
│  │     └─────────┘     │    │     └─────────┘     │         │
│  └─────────────────────┘    └─────────────────────┘         │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │              Internet Gateway (IGW)               │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Flux réseau

```
1. User → https://app-lucas.duckdns.org (port 443)
       ↓
2. DuckDNS résout → ALB DNS (IP publique)
       ↓
3. ALB reçoit, termine TLS (certificat ACM)
       ↓
4. ALB forward vers Target Group (port 3000, HTTP)
       ↓
5. EC2 reçoit sur port 3000 → Docker → app TanStack Start
       ↓
6. L'app lit/écrit : RDS (5432), S3 (443), Cognito
```

**Sécurité** : les EC2 n'ont pas de règle `0.0.0.0/0` sur le port 3000. Seul l'ALB peut les atteindre. Si tu tapes `http://<ip-publique-ec2>:3000`, ça ne répond pas.

---

## Déploiement from scratch

### 1. Cloner le repo

```bash
git clone https://github.com/Luckise/Devops-projet-Lucas-Riyad.git
cd Devops-projet-Lucas-Riyad
```

### 2. Configurer les variables

```bash
# Terraform
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
# Éditer avec vos valeurs : enable_https, ec2_ami_id, etc.

# Ansible vault — stocker les secrets (db_password, cognito IDs)
# Le fichier vault.yml est chiffré et gitignoré
ansible-vault encrypt_string 'votre_mdp_rds' --name 'db_password' \
  >> ansible/inventory/group_vars/all/vault.yml
ansible-vault encrypt_string 'eu-west-3_xxx' --name 'cognito_user_pool_id' \
  >> ansible/inventory/group_vars/all/vault.yml
ansible-vault encrypt_string 'xxx' --name 'cognito_client_id' \
  >> ansible/inventory/group_vars/all/vault.yml

# Le fichier .vault_pass contient le mot de passe pour déchiffrer le vault
# Il est requis pour exécuter tous les playbooks Ansible
echo "votre_mdp_vault" > ansible/.vault_pass
chmod 600 ansible/.vault_pass
```

### 3. Configurer les GitHub Secrets

Dans Settings → Secrets → Actions, ajouter :

| Secret                      | Description                         |
| --------------------------- | ----------------------------------- |
| `VITE_COGNITO_USER_POOL_ID` | ID du User Pool Cognito             |
| `VITE_COGNITO_CLIENT_ID`    | ID du Client Cognito                |
| `AWS_ACCESS_KEY_ID`         | Clé d'accès AWS pour GitHub Actions |
| `AWS_SECRET_ACCESS_KEY`     | Clé secrète AWS pour GitHub Actions |
| `RDS_PASSWORD`              | Mot de passe de la base RDS         |
| `S3_BUCKET_NAME`            | Nom du bucket S3 assets             |

### 4. Provisionner l'infrastructure AWS

```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
cd ..
```

### 5. Générer l'inventaire Ansible

```bash
./ansible/generate_inventory.sh
```

### 6. Déployer l'application avec Ansible

```bash
# Configuration complète des instances (common → app → backup)
ansible-playbook ansible/playbooks/site.yml -i ansible/inventory/hosts.yml \
  --vault-password-file ansible/.vault_pass

# Déploiement d'une nouvelle version (pull image + restart + health check)
ansible-playbook ansible/playbooks/deploy.yml -i ansible/inventory/hosts.yml \
  --vault-password-file ansible/.vault_pass
```

> **Important** : L'argument `--vault-password-file ansible/.vault_pass` est **obligatoire** pour tous les playbooks. Il permet à Ansible de déchiffrer le vault contenant le mot de passe RDS et les identifiants Cognito, qui sont ensuite passés aux conteneurs Docker via les variables d'environnement.

### 7. (Bonus) Restauration depuis S3

```bash
ansible-playbook ansible/playbooks/restore.yml -i ansible/inventory/hosts.yml \
  --vault-password-file ansible/.vault_pass
```

---

## Terraform

Tout le cloud est défini dans `terraform/`. Modules par responsabilité :

| Module            | Ressources principales                                   |
| ----------------- | -------------------------------------------------------- |
| `vpc`             | VPC 10.0.0.0/16, 2 publics + 2 privés, IGW, route table  |
| `security-groups` | SG ALB → SG App → SG DB (chaînés)                        |
| `ec2`             | 2 instances Ubuntu 22.04, IAM role (ECR + S3)            |
| `alb`             | ALB internet-facing, HTTPS (ACM), target group port 3000 |
| `rds`             | PostgreSQL 16, subnet privé, backup 1 jour, encrypted    |
| `s3`              | 2 buckets (assets + backups), AES256, versioning         |
| `ecr`             | Docker registry, lifecycle policy (garder 5 images)      |
| `cognito`         | User pool, app client, password policy                   |

**Outputs clés** (utilisés par Ansible) : `ec2_instance_ids`, `alb_dns_name`, `rds_endpoint`, `buckets`, `ecr`, `cognito_user_pool_id`, `cognito_app_client_id`.

### Règles réseau (Security Groups)

| SG  | Inbound                                | Outbound |
| --- | -------------------------------------- | -------- |
| ALB | 443 + 80 depuis `0.0.0.0/0`            | all      |
| App | 3000 depuis SG ALB, 22 depuis IP admin | all      |
| DB  | 5432 depuis SG App                     | all      |

---

## Ansible

### Inventaire

Généré dynamiquement depuis les outputs Terraform via `ansible/generate_inventory.sh`. Utilise AWS SSM (Session Manager) pour la connexion — pas besoin de clé SSH publique sur chaque instance.

### Rôles

| Rôle       | Actions principales                                                             |
| ---------- | ------------------------------------------------------------------------------- |
| **common** | Installation Docker + AWS CLI, création user/groupe système, credentials AWS    |
| **app**    | Login ECR, pull image Docker, installation service systemd, démarrage conteneur |
| **backup** | Installation script pg_dump, configuration cron quotidien (2h00), upload S3     |

### Variables

Dans `ansible/inventory/group_vars/` :

- `all/main.yml` : variables communes (région, endpoints, noms de buckets...)
- `all/vault.yml` : secrets chiffrés avec Ansible Vault (db_password, cognito IDs...)
- `all/ecr.yml` : généré automatiquement par `generate_inventory.sh`
- `app.yml` : variables spécifiques au groupe `app`

### Vault password

Le fichier `ansible/.vault_pass` contient le mot de passe pour déchiffrer le vault. Il est **requis** pour exécuter tous les playbooks :

```bash
ansible-playbook ansible/playbooks/deploy.yml -i ansible/inventory/hosts.yml \
  --vault-password-file ansible/.vault_pass
```

Sans cet argument, Ansible ne peut pas accéder aux secrets (mot de passe RDS, identifiants Cognito) et les conteneurs Docker ne démarreront pas correctement.

### Playbooks

| Playbook      | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `site.yml`    | Configuration complète des instances (common → app → backup) |
| `deploy.yml`  | Pull dernière image Docker + restart + health check          |
| `restore.yml` | Récupère le dernier backup S3 et restaure la BDD             |

---

## Molecule - Tester les rôles Ansible

Chaque rôle Ansible est couvert par un scénario Molecule avec driver Docker.

### Lancer tous les tests

```bash
cd ansible
molecule test
```

### Lancer un rôle spécifique

```bash
molecule test -s common
molecule test -s app
molecule test -s backup
```

### Ce que les tests vérifient

- **common** : Docker actif, paquets installés, user système créé, credentials AWS présents
- **app** : image Docker pullée, conteneur tourne sur le port 3000, service systemd enabled
- **backup** : répertoire de backup créé, script backup.sh présent, cron job configuré

### Fonctionnement

```bash
# molecule.yml utilise le driver Docker
# Les tests sont écrits en YAML (Ansible checks) dans molecule/default/tests/
# Syntaxe :
molecule create    # Crée les conteneurs de test
molecule converge  # Applique le rôle
molecule verify    # Vérifie les assertions
molecule destroy   # Nettoie
# → molecule test fait tout ça en une commande
```

Les tests tournent en local avec Docker — aucun accès AWS nécessaire. Chaque test vérifie que le service est actif et que les ports attendus répondent.

---

## CI/CD - GitHub Actions

Deux workflows :

### `ci.yml` — Sur push et PR

```
Push sur main
       ↓
  [Lint + Format]    ← oxfmt --check + oxlint
       ↓ (si main)
  [Build Docker]     ← docker build (avec build-args pour Cognito, DB, S3)
       ↓
  [Push ECR]        ← docker push (latest)
       ↓
  [Ansible Deploy]  ← ansible-playbook deploy.yml (pull + restart + health check)
```

Le workflow CI build et push l'image vers ECR (tag `latest`). Le déploiement Ansible est déclenché manuellement via `ansible-playbook deploy.yml` — il pull la dernière image et redémarre les conteneurs.

## Stratégie de backup

### Base de données

- **Fréquence** : toutes les nuits à 2h00 (cron géré par le rôle Ansible `backup`)
- **Méthode** : `pg_dump` de la base PostgreSQL, fichier horodaté au format `.sql`
- **Rétention locale** : 7 jours (les fichiers locaux > 7j sont nettoyés par le script)
- **Destination** : upload automatique vers le bucket S3 `devops-projet-lucas-riyad-dev-backups-*`
- **Rétention S3** : lifecycle policy qui expire les objets après 7 jours

### Fichiers applicatifs

- Les assets uploadés par les utilisateurs sont stockés dans le bucket S3 séparé `devops-projet-lucas-riyad-dev-assets-*`
- Le bucket assets est en versioning activé pour permettre le rollback en cas de suppression accidentelle

### Pourquoi ces choix

- `pg_dump` plutôt qu'un snapshot RDS : le dump est portable, on peut le restaurer sur n'importe quelle BDD PostgreSQL (pas besoin d'être sur AWS)
- Backup à 2h du matin : heure creuse, minimiser l'impact sur les utilisateurs
- Rétention 7 jours : compromis entre coût de stockage S3 et fenêtre de restauration acceptable pour un projet étudiant
- Lifecycle S3 plutôt que nettoyage côté script : AWS gère l'expiration automatiquement, pas de risque d'oubli

---

## Restauration (bonus)

Le playbook `ansible/playbooks/restore.yml` permet de restaurer la base de données depuis le dernier backup S3.

### Procédure

```bash
ansible-playbook ansible/playbooks/restore.yml -i ansible/inventory/hosts.yml
```

### Ce que fait le playbook

1. Liste les backups dans le bucket S3, identifie le plus récent
2. Télécharge le fichier sur l'instance
3. Restaure avec `psql` dans la base RDS
4. Nettoie le fichier temporaire

### Conditions

- Le fichier de backup doit être accessible depuis le bucket S3
- L'utilisateur PostgreSQL doit avoir les droits pour créer/tronquer les tables
- La base de destination doit exister (créée par Terraform)

---

## Sécurité

- **Credentials AWS** : jamais en clair. Les EC2 utilisent une IAM Role (pas de clés statiques). L'Ansible Vault est utilisé pour le mot de passe RDS.
- **Secrets dans le repo** : `.gitignore` exclut `*.tfstate`, `*.tfvars`, `vault.yml`, `*.pem`, `.env`. Toute credential commitée en clair par erreur est une pénalité automatique.
- **GitHub Actions Secrets** : `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `RDS_PASSWORD`, `S3_BUCKET_NAME` — tous requis pour le build CI et le déploiement.
- **Réseau** : RDS dans subnet privé, pas d'IP publique. EC2 accessibles uniquement sur le port 22 (SSH) et seulement depuis une IP admin, ou via SSM Session Manager.
- **ALB** : seul point d'entrée, TLS terminé au niveau de l'ALB. Les EC2 reçoivent le trafic en HTTP clair.
- **Bucket S3** : blocs d'accès public activés, chiffrement AES256 côté serveur.
- **Cognito** : App Client sans client secret pour les appels browser. Les opérations sensibles (AdminAddUserToGroup) passent par des API routes serveur.

---

## Structure du repo

```
.
├── terraform/                    # IaC AWS (Terraform)
│   ├── main.tf                   # Modules orchestration
│   ├── variables.tf              # Variables d'entrée
│   ├── outputs.tf                # Outputs → inventaire Ansible
│   ├── provider.tf               # Provider AWS
│   ├── versions.tf               # Versions Terraform
│   └── modules/
│       ├── vpc/                  # VPC + subnets + IGW
│       ├── ec2/                  # Instances + IAM role
│       ├── alb/                  # Load balancer + target group
│       ├── rds/                  # PostgreSQL RDS
│       ├── s3/                   # Assets + buckets backups
│       ├── ecr/                  # Docker registry
│       ├── cognito/              # User pool auth
│       └── security-groups/      # SG chaînés ALB→App→DB
├── ansible/                      # Configuration management
│   ├── inventory/
│   │   ├── hosts.yml             # Généré par generate_inventory.sh
│   │   └── group_vars/
│   │       ├── all/
│   │       │   ├── main.yml      # Variables communes
│   │       │   ├── vault.yml     # Secrets chiffrés
│   │       │   ├── ecr.yml       # Généré dynamiquement
│   │       │   └── ssm.yml       # Généré dynamiquement
│   │       └── app.yml           # Vars groupe app
│   ├── roles/
│   │   ├── common/               # Docker + AWS CLI + user
│   │   ├── app/                  # Pull image + systemd
│   │   └── backup/               # pg_dump + cron + S3
│   ├── playbooks/
│   │   ├── site.yml              # Configuration complète des instances
│   │   ├── deploy.yml            # Pull image + restart + health check
│   │   └── restore.yml           # Restauration depuis S3 (bonus)
│   ├── molecule/                 # Tests Molecule
│   │   └── default/
│   │       └── tests/            # Assertions par rôle
│   └── generate_inventory.sh     # Script de génération d'inventaire
├── src/                          # App TanStack Start
├── .github/workflows/            # CI/CD (lint, build, push, deploy)
├── Dockerfile
├── package.json
├── tsconfig.json
├── vite.config.ts
├── ansible.cfg
└── .gitignore                    # Exclusions de sécurité
```

---

## Accès

| Ressource   | URL / Endpoint                                                                                |
| ----------- | --------------------------------------------------------------------------------------------- |
| Application | https://app-lucas.duckdns.org                                                                 |
| Cognito     | User Pool `eu-west-3_lVGeXq3XV`, App Client `6o96ffav0fggnv1hpaihik38d9`                      |
| RDS         | `devops-projet-lucas-riyad-dev-db-72f9c285.cvgqemogmgnt.eu-west-3.rds.amazonaws.com:5432/app` |
| ECR         | `697359331837.dkr.ecr.eu-west-3.amazonaws.com/devops-projet-lucas-riyad-dev-app`              |
| S3 assets   | `devops-projet-lucas-riyad-dev-assets-e5f3e56b`                                               |
| S3 backups  | `devops-projet-lucas-riyad-dev-backups-e5f3e56b`                                              |
| EC2 1       | `i-0a8987c4ea7c4188b` (15.224.19.226)                                                         |
| EC2 2       | `i-09e51ec0c58363c14` (51.44.250.124)                                                         |
| ACM cert    | `arn:aws:acm:eu-west-3:697359331837:certificate/abdae829-fe52-489d-8a92-925f72c24922`         |

---

## Galères rencontrées

- **ALB ne forward pas automatiquement le chemin** : il faut bien configurer le target group sur le bon port et un health check qui répond 200 (`/events`).
- **ECR login expire toutes les 12h** : Ansible doit refaire `aws ecr get-login-password` à chaque déploiement.
- **Security groups chaînés** : on référence le SG par son ID (`aws_security_group.app.id`), pas par son nom — sinon Terraform ne détecte pas les changements.
- **DNS gratuit via DuckDNS** : on utilise `app-lucas.duckdns.org` au lieu de Route 53 (payant). DuckDNS pointe vers l'ALB. Le certificat ACM est valide pour le domaine.
- **Docker restart** : sans `force_source: true`, Docker ne re-pull pas l'image si le tag existe déjà en cache. On a utilisé `ansible.builtin.shell` avec `docker pull` pour forcer.
- **aws-amplify et Vite 8/Rolldown** : les modules CJS comme `amazon-cognito-identity-js` posent des problèmes de class heritage. Solution : lazy imports dynamiques pour tous les modules côté serveur (pg, drizzle, AWS SDK) via `import()` dans le container DI.
- **Buffer is not defined** : le driver `pg` (node-postgres) utilise `Buffer` qui n'existe pas dans le browser. Solution : `define: { global: "globalThis" }` dans vite.config.ts + polyfill `globalThis.Buffer` importé en premier dans router.tsx.
- **Cognito SECRET_HASH** : l'App Client avait un client secret configuré, mais les appels browser ne peuvent pas utiliser de secret. Solution : créer un nouvel App Client sans secret via AWS CLI.
