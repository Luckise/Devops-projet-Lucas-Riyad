variable "project_name" {
  description = "Project name used to prefix Terraform-managed resources."
  type        = string
  default     = "devops-projet-lucas-riyad"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "dev"
}

variable "common_tags" {
  description = "Tags applied to all logical components."
  type        = map(string)
  default     = {}
}

variable "app_domain_name" {
  description = "Application domain name for HTTPS and DNS."
  type        = string
  default     = "app.infra.lucas-demo"
}

variable "subject_alternative_names" {
  description = "Subject alternative names for ACM certificate."
  type        = list(string)
  default     = []
}

variable "enable_https" {
  description = "Enable HTTPS for the ALB."
  type        = bool
  default     = true
}

variable "alb_name" {
  description = "Logical name reserved for the application load balancer."
  type        = string
  default     = "app-alb"
}

variable "alb_dns_name" {
  description = "DNS name for the application load balancer."
  type        = string
  default     = ""
}

variable "alb_zone_id" {
  description = "Zone ID for the application load balancer."
  type        = string
  default     = ""
}

variable "app_container_port" {
  description = "Port exposed by the application container."
  type        = number
  default     = 3000
}

variable "app_health_check_path" {
  description = "Health check path used by the load balancer target group."
  type        = string
  default     = "/health"
}

variable "certificate_arn" {
  description = "ACM certificate ARN used by the HTTPS listener."
  type        = string
  default     = ""
}

variable "tags" {
  description = "Logical tags for the load balancer plan."
  type        = map(string)
  default     = {}
}


