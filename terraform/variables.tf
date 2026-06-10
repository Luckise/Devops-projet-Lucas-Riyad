variable "project_name" {
  description = "Project name used to prefix Terraform-managed resources."
  type        = string
  default     = "devops-projet-lucas-riyad"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region for the infrastructure."
  type        = string
  default     = "eu-west-3"
}

variable "aws_profile" {
  description = "Optional named AWS profile used by Terraform."
  type        = string
  default     = ""
}

variable "common_tags" {
  description = "Tags applied to all logical components."
  type        = map(string)
  default     = {}
}

variable "availability_zones" {
  description = "Availability zones to target in the selected region."
  type        = list(string)
  default     = ["eu-west-3a", "eu-west-3b"]
}

variable "vpc_cidr" {
  description = "CIDR block used for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks reserved for public subnets."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks reserved for private subnets."
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "admin_cidr_blocks" {
  description = "CIDR blocks allowed to access SSH on the application instances."
  type        = list(string)
  default     = []
}

variable "app_container_port" {
  description = "Port exposed by the application container."
  type        = number
  default     = 3000
}

variable "app_health_check_path" {
  description = "Health check path used by the load balancer target group."
  type        = string
  default     = "/health"
}

variable "ec2_instance_count" {
  description = "Number of application instances to plan for."
  type        = number
  default     = 1
}

variable "ec2_instance_type" {
  description = "EC2 instance type reserved for the application tier."
  type        = string
  default     = "t3.micro"
}

variable "ec2_ami_id" {
  description = "AMI identifier for the application instances."
  type        = string
  default     = ""
}

variable "ec2_key_pair_name" {
  description = "Key pair name used for SSH access to the instances."
  type        = string
  default     = ""
}

variable "alb_name" {
  description = "Logical name reserved for the application load balancer."
  type        = string
  default     = "app-alb"
}

variable "certificate_arn" {
  description = "ACM certificate ARN used by the HTTPS listener."
  type        = string
  default     = ""
}

variable "asset_bucket_name" {
  description = "Bucket name reserved for application uploads and assets."
  type        = string
  default     = ""
}

variable "backup_bucket_name" {
  description = "Bucket name reserved for database backups."
  type        = string
  default     = ""
}

variable "cognito_user_pool_name" {
  description = "User pool name reserved for authentication."
  type        = string
  default     = ""
}

variable "cognito_app_client_name" {
  description = "App client name reserved for the frontend application."
  type        = string
  default     = ""
}

variable "rds_identifier" {
  description = "Database identifier reserved for the PostgreSQL instance."
  type        = string
  default     = ""
}

variable "rds_db_name" {
  description = "Logical database name planned for the application."
  type        = string
  default     = "app"
}

variable "rds_engine" {
  description = "Database engine planned for the managed database."
  type        = string
  default     = "postgres"
}

variable "rds_engine_version" {
  description = "Database engine version reserved for the PostgreSQL instance."
  type        = string
  default     = "16.14"
}

variable "rds_instance_class" {
  description = "Instance class reserved for the managed database."
  type        = string
  default     = "db.t3.micro"
}

variable "rds_allocated_storage" {
  description = "Allocated storage in gigabytes reserved for the database."
  type        = number
  default     = 20
}

variable "rds_backup_retention_days" {
  description = "Backup retention in days reserved for the database."
  type        = number
  default     = 1
}

variable "ecr_repository_name" {
  description = "Name reserved for the ECR repository."
  type        = string
  default     = ""
}

variable "security_group_name_prefix" {
  description = "Prefix planned for the security group naming scheme."
  type        = string
  default     = "app"
}