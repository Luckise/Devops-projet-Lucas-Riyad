variable "name_prefix" {
  description = "Prefix used to derive Cognito resource names."
  type        = string
}

variable "user_pool_name" {
  description = "User pool name planned for authentication."
  type        = string
}

variable "app_client_name" {
  description = "App client name planned for the frontend."
  type        = string
}

variable "domain_prefix" {
  description = "Planned domain prefix for the Cognito hosted UI."
  type        = string
  default     = ""
}

variable "callback_urls" {
  description = "Callback URLs for the Cognito app client."
  type        = list(string)
  default     = []
}

variable "logout_urls" {
  description = "Logout URLs for the Cognito app client."
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Logical tags for the authentication plan."
  type        = map(string)
  default     = {}
}