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
}

variable "subnet_cidrs" {
  description = "Subnets reserved for the managed database."
  type        = list(string)
}

variable "security_group_names" {
  description = "Security groups planned for database access."
  type        = list(string)
}

variable "allocated_storage" {
  description = "Allocated storage in gigabytes."
  type        = number
}

variable "backup_retention_days" {
  description = "Backup retention in days."
  type        = number
}

variable "tags" {
  description = "Logical tags for the database plan."
  type        = map(string)
  default     = {}
}