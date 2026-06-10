variable "name_prefix" {
  description = "Prefix used to derive ECR repository name."
  type        = string
}

variable "repository_name" {
  description = "Name of the ECR repository."
  type        = string
  default     = ""
}

variable "image_tag_mutability" {
  description = "Tag mutability setting for the repository."
  type        = string
  default     = "MUTABLE"
}

variable "scan_on_push" {
  description = "Whether images are scanned after being pushed."
  type        = bool
  default     = true
}

variable "encryption_type" {
  description = "Encryption type for the repository (AES256 or KMS)."
  type        = string
  default     = "AES256"
}

variable "tags" {
  description = "Logical tags for the ECR plan."
  type        = map(string)
  default     = {}
}
