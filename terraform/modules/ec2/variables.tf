variable "name_prefix" {
  type        = string
  description = "Prefix for EC2 resources"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
}

variable "private_app_subnet_ids" {
  type        = list(string)
  description = "Private app subnet ids"
}

variable "ec2_security_group_id" {
  type        = string
  description = "EC2 security group id"
}

variable "target_group_arn" {
  type        = string
  description = "ALB target group ARN"
}
