variable "name_prefix" {
  type        = string
  description = "Prefix for RDS resources"
}

variable "private_db_subnet_ids" {
  type        = list(string)
  description = "Private DB subnet ids"
}

variable "rds_security_group_id" {
  type        = string
  description = "RDS security group id"
}

variable "instance_class" {
  type        = string
  description = "RDS instance class"
}

variable "engine_version" {
  type        = string
  description = "Postgres engine version"
}

variable "db_name" {
  type        = string
  description = "Initial database name"
}

variable "username" {
  type        = string
  description = "Master username"
}

variable "password" {
  type        = string
  sensitive   = true
  description = "Master password"
}
