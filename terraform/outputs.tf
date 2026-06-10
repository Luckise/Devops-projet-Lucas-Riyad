output "terraform_plan_summary" {
  description = "High-level summary of the planned infrastructure shape."
  value = {
    environment          = var.environment
    region               = var.aws_region
    vpc_cidr             = var.vpc_cidr
    public_subnet_cidrs  = var.public_subnet_cidrs
    private_subnet_cidrs = var.private_subnet_cidrs
    app_instances        = var.ec2_instance_count
  }
}

output "security_groups" {
  description = "Planned security group names."
  value = {
    alb = module.security_groups.alb_security_group_name
    app = module.security_groups.app_security_group_name
    db  = module.security_groups.db_security_group_name
  }
}

output "buckets" {
  description = "Planned S3 bucket names."
  value = {
    assets  = module.s3.asset_bucket_name
    backups = module.s3.backup_bucket_name
  }
}

output "authentication" {
  description = "Planned Cognito identifiers."
  value = {
    user_pool_name  = module.cognito.user_pool_name
    app_client_name = module.cognito.app_client_name
  }
}

output "ecr" {
  description = "Planned ECR repository details."
  value = {
    repository_name = module.ecr.repository_name
    repository_url  = module.ecr.repository_url
  }
}

output "ec2_app_ips" {
  description = "Planned application instance IP addresses."
  value       = module.ec2.public_ips
}

output "alb_dns_name" {
  description = "Load balancer DNS name."
  value       = module.alb.dns_name
}

output "rds_endpoint" {
  description = "Database endpoint."
  value       = module.rds.endpoint
}

output "rds_username" {
  description = "Database master username."
  value       = module.rds.username
}

output "rds_password" {
  description = "Database master password."
  value       = module.rds.password
  sensitive   = true
}

output "cognito_user_pool_id" {
  description = "Cognito user pool ID."
  value       = module.cognito.user_pool_id
}

output "cognito_app_client_id" {
  description = "Cognito app client ID."
  value       = module.cognito.app_client_id
}