# DevOps Projet - Lucas & Riyad

Projet d'infrastructure et déploiement — 4e année EFREI.

On déploie une app TanStack Start (full-stack SSR) sur 2 EC2 derrière un ALB, avec RDS PostgreSQL, Cognito pour l'auth, S3 pour les assets et backups, le tout provisionné en Terraform, configuré avec Ansible et livré en CI/CD via GitHub Actions.

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

- **AWS account** avec les permissions pour créer VPC, EC2, RDS, ALB, S3, Cognito, ECR, Route 53
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
                      [Route 53]
                     app-lucas-riyad.com
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
  [Route 53]                   ← DNS : app-lucas-riyad.com
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
1. User → https://app-lucas-riyad.com (port 443)
       ↓
2. Route 53 résout → ALB DNS (IP publique)
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
git clone <url-du-repo>
cd projet-devops
```

### 2. Configurer les variables

```bash
# Terraform
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
# Éditer avec vos valeurs : admin_cidr_blocks, bucket names, etc.

# Ansible vault (optionnel, recommandé pour les secrets)
ansible-vault encrypt_string 'motdepasse' --name 'db_password' \
  >> ansible/inventory/group_vars/all/vault.yml
```

### 3. Provisionner l'infrastructure AWS

```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
cd ..
```

### 4. Générer l'inventaire Ansible

```bash
./ansible/generate_inventory.sh
```

### 5. Déployer l'application avec Ansible

```bash
ansible-playbook ansible/playbooks/site.yml -i ansible/inventory/hosts.yml
```

### 6. (Bonus) Restauration depuis S3

```bash
ansible-playbook ansible/playbooks/restore.yml -i ansible/inventory/hosts.yml
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
- `all/vault.yml` : secrets chiffrés avec Ansible Vault (db_password, tokens...)
- `all/ecr.yml` : généré automatiquement par `generate_inventory.sh`
- `app.yml` : variables spécifiques au groupe `app`

### Playbooks

| Playbook      | Description                                         |
| ------------- | --------------------------------------------------- |
| `site.yml`    | Configure les instances app (common → app → backup) |
| `restore.yml` | Récupère le dernier backup S3 et restaure la BDD    |

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
Push sur main / PR
       ↓
  [Lint + Format]    ← oxlint + oxfmt --check
       ↓ (si main)
  [Build Docker]     ← docker build -t <ecr_url>:sha-<sha> -t <ecr_url>:latest
       ↓
  [Push ECR]        ← docker push (sha + latest)
       ↓
  [Deploy]          ← ansible-playbook site.yml -e app_image_tag=sha-<sha>
```

Le tag `sha-<git_sha>` permet de tracer exactement quelle version tourne sur chaque EC2. Le tag `latest` est mis à jour à chaque push sur main pour le bootstrap des nouvelles instances.

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
- **Réseau** : RDS dans subnet privé, pas d'IP publique. EC2 accessibles uniquement sur le port 22 (SSH) et seulement depuis une IP admin, ou via SSM Session Manager.
- **ALB** : seul point d'entrée, TLS terminé au niveau de l'ALB. Les EC2 reçoivent le trafic en HTTP clair.
- **Bucket S3** : blocs d'accès public activés, chiffrement AES256 côté serveur.

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
│   │   ├── site.yml              # Déploiement principal
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

## Galères rencontrées

- **ALB ne forwarde pas automatiquement le chemin** : il faut bien configurer le target group sur le bon port et un health check qui répond 200 (`/health`).
- **ECR login expire toutes les 12h** : Ansible doit refaire `aws ecr get-login-password` à chaque déploiement.
- **Security groups chaînés** : on référence le SG par son ID (`aws_security_group.app.id`), pas par son nom — sinon Terraform ne détecte pas les changements.
- **Route 53 + Duck DNS** : on ne peut pas faire un alias Route 53 vers un nom de domaine externe directement. La solution est une délégation NS.
- **Docker restart** : sans `force_source: true`, Docker ne re-pull pas l'image si le tag existe déjà en cache. On a utilisé `ansible.builtin.shell` avec `docker pull` pour forcer.
- **oxlint/oxfmt** : ce sont des outils Rust distribués via npm. Installation avec `npm i -g oxlint` ou via les devDependencies du projet.
