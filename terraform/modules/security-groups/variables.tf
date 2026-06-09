variable "name_prefix" {
  description = "Prefix used to derive security group names."
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block used by the VPC."
  type        = string
}

variable "admin_cidr_blocks" {
  description = "CIDR blocks allowed to reach SSH."
  type        = list(string)
  default     = []
}

variable "app_port" {
  description = "Port used by the application tier."
  type        = number
}

variable "db_port" {
  description = "Port used by the database tier."
  type        = number
}

variable "alb_port" {
  description = "Port exposed by the application load balancer."
  type        = number
}