variable "name" {
  description = "Name planned for the application load balancer."
  type        = string
}

variable "subnet_cidrs" {
  description = "Subnets reserved for the public entry layer."
  type        = list(string)
}

variable "security_group_names" {
  description = "Security groups planned for the load balancer."
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