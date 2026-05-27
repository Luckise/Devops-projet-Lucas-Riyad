variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "eu-west-3"
}

variable "project_name" {
  description = "Name prefix for AWS resources"
  type        = string
  default     = "devops-app"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs"
  type        = list(string)
  default     = ["10.0.0.0/24", "10.0.1.0/24"]
}

variable "private_app_subnet_cidrs" {
  description = "Private app subnet CIDRs"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "private_db_subnet_cidrs" {
  description = "Private DB subnet CIDRs"
  type        = list(string)
  default     = ["10.0.20.0/24", "10.0.21.0/24"]
}

variable "ec2_instance_type" {
  description = "Instance type for the two EC2 instances"
  type        = string
  default     = "t3.micro"
}

variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "rds_engine_version" {
  description = "Postgres engine version"
  type        = string
  default     = "16.3"
}

variable "rds_db_name" {
  description = "Initial RDS database name"
  type        = string
  default     = "appdb"
}

variable "rds_username" {
  description = "RDS master username"
  type        = string
  default     = "appuser"
}

variable "rds_password" {
  description = "RDS master password"
  type        = string
  sensitive   = true
}

variable "alb_certificate_arn" {
  description = "ACM certificate ARN for the ALB HTTPS listener"
  type        = string
}

variable "ecs_container_image" {
  description = "Container image for the ECS service"
  type        = string
  default     = "nginx:latest"
}
