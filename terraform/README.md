# Terraform scaffold

This directory contains the initial Terraform structure for the infrastructure workstream.

The current state is a scaffold only:

- root inputs and outputs are defined
- module boundaries are laid out by responsibility
- no AWS resources are created yet

The next step is to replace the stubs with concrete AWS resources for VPC, ALB, EC2, RDS, S3, Cognito, and security groups.

## AWS connection

Terraform uses the standard AWS credential chain. The recommended setup is:

1. Authenticate with `aws configure` or `aws sso login`.
2. Optionally set `aws_profile` when you want Terraform to use a named local profile.
3. Keep secrets out of the repository; credentials should come from the AWS CLI config, environment variables, or an instance role.

Example:

```bash
terraform -chdir=terraform init
terraform -chdir=terraform plan -var='aws_profile=default'
```