variable "name_prefix" {
  description = "Prefix used to derive database resource names."
  type        = string
}

variable "vpc_id" {
  description = "VPC identifier where the database is deployed."
  type        = string
}

variable "identifier" {
  description = "Database identifier planned for PostgreSQL."
  type        = string
}

variable "db_name" {
  description = "Database name planned for the application."
  type        = string
}

variable "engine" {
  description = "Database engine planned for the managed database."
  type        = string
}

variable "engine_version" {
  description = "Database engine version planned for the managed database."
  type        = string
}

variable "instance_class" {
  description = "Instance class planned for the managed database."
  type        = string
  default     = "db.t2.micro"
}

variable "subnet_ids" {
  description = "Private subnets reserved for the managed database."
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security groups planned for database access."
  type        = list(string)
}

variable "username" {
  description = "Master username for the database instance."
  type        = string
  default     = "app"
}

variable "port" {
  description = "Database port."
  type        = number
  default     = 5432
}

variable "allocated_storage" {
  description = "Allocated storage in gigabytes."
  type        = number
  default     = 20
}

variable "backup_retention_days" {
  description = "Backup retention in days."
  type        = number
  default     = 1
}


variable "deletion_protection" {
  description = "Whether deletion protection is enabled."
  type        = bool
  default     = false
}

variable "tags" {
  description = "Logical tags for the database plan."
  type        = map(string)
  default     = {}
}