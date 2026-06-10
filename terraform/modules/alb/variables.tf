variable "name" {
  description = "Name planned for the application load balancer."
  type        = string
}

variable "name_prefix" {
  description = "Prefix used to derive ALB resource names."
  type        = string
}

variable "vpc_id" {
  description = "VPC identifier where the load balancer is deployed."
  type        = string
}

variable "public_subnet_ids" {
  description = "Subnets reserved for the public entry layer."
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security groups planned for the load balancer."
  type        = list(string)
}

variable "target_instance_ids" {
  description = "EC2 instance identifiers used by the target group."
  type        = list(string)
}

variable "certificate_arn" {
  description = "Certificate ARN planned for HTTPS."
  type        = string
  default     = ""
}

variable "target_port" {
  description = "Port to forward traffic to on the app tier."
  type        = number
}

variable "health_check_path" {
  description = "Health check path reserved for the target group."
  type        = string
}

variable "tags" {
  description = "Logical tags for the load balancer plan."
  type        = map(string)
  default     = {}
}