variable "name_prefix" {
  type        = string
  description = "Prefix for ALB resources"
}

variable "vpc_id" {
  type        = string
  description = "VPC id"
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "Public subnet ids"
}

variable "alb_security_group_id" {
  type        = string
  description = "ALB security group id"
}

variable "alb_certificate_arn" {
  type        = string
  description = "ACM certificate ARN for the HTTPS listener"
}
