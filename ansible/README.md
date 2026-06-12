# Ansible scaffold

This directory contains the initial Ansible structure for the EC2 deployment layer.

The current scaffold covers:

- dynamic inventory generation from Terraform outputs
- a site playbook that targets the application instances
- role boundaries for `common`, `app`, and `backup`
- a vault example for sensitive variables

The next step is to connect these roles to the real Terraform outputs and instance metadata.

## Fill in the configuration

Before the first deployment, set the following values in `ansible/group_vars/all/main.yml` and `ansible/group_vars/all/vault.yml`:

- `ssh_user`
- `app_user`
- `app_install_dir`
- `app_backup_dir`
- `app_container_port`
- `app_node_env`
- `app_backup_cron_minute`
- `app_backup_cron_hour`
- `aws_credentials_mode`
- `ecr_registry`
- `app_image_repository`
- `aws_region`
- `aws_profile` if you use a local AWS profile
- `aws_cli_bin`
- `docker_bin`
- `pg_dump_bin`
- `asset_bucket_name`
- `backup_bucket_name`
- `backup_s3_prefix`
- `backup_local_dir`
- `backup_file_prefix`
- `backup_file_extension`
- `db_host`
- `db_name`
- `db_user`
- `db_password` if not using another secret source
- `cognito_user_pool_id`
- `cognito_client_id`

If you use Vault-managed secrets, create `ansible/group_vars/all/vault.yml` from the example file and encrypt the sensitive values.

## Generate inventory

Run the helper from the repository root after Terraform has created the outputs:

```bash
./ansible/generate_inventory.sh
```

The repository root also contains an `ansible.cfg` so `ansible-playbook` can be run from the project root without extra flags.

## Vault

Store encrypted secrets with `ansible-vault` instead of plain text files. A typical workflow is:

```bash
ansible-vault encrypt_string 'motdepasse' --name 'db_password'
```

Write the encrypted value into `ansible/group_vars/all/vault.yml`.

Recommended sensitive entries:

- `db_password`
- `aws_access_key_id`
- `aws_secret_access_key`
- `aws_session_token`

The inventory generator can also take `ANSIBLE_SSH_USER` from the environment if the SSH login differs from `ubuntu`.
