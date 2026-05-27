variable "name_prefix" {
  type        = string
  description = "Prefix for ECS resources"
}

variable "aws_region" {
  type        = string
  description = "AWS region"
}

variable "private_app_subnet_ids" {
  type        = list(string)
  description = "Private app subnet ids"
}

variable "ecs_security_group_id" {
  type        = string
  description = "ECS security group id"
}

variable "container_image" {
  type        = string
  description = "Container image for the ECS task"
}
