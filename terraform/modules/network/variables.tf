variable "name_prefix" {
  type        = string
  description = "Prefix for network resources"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "Public subnet CIDRs"
}

variable "private_app_subnet_cidrs" {
  type        = list(string)
  description = "Private app subnet CIDRs"
}

variable "private_db_subnet_cidrs" {
  type        = list(string)
  description = "Private DB subnet CIDRs"
}
