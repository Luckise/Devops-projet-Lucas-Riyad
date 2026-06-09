variable "name" {
  description = "Logical VPC name."
  type        = string
}

variable "cidr_block" {
  description = "CIDR block reserved for the VPC."
  type        = string
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks planned for public subnets."
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks planned for private subnets."
  type        = list(string)
}

variable "availability_zones" {
  description = "Availability zones targeted by the design."
  type        = list(string)
}

variable "tags" {
  description = "Logical tags attached to the VPC design."
  type        = map(string)
  default     = {}
}