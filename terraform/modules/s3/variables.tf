variable "name_prefix" {
  description = "Prefix used to derive S3 bucket names."
  type        = string
}

variable "asset_bucket_name" {
  description = "Bucket name planned for application assets."
  type        = string
}

variable "backup_bucket_name" {
  description = "Bucket name planned for database backups."
  type        = string
}

variable "versioning_enabled" {
  description = "Whether versioning should be enabled on the planned buckets."
  type        = bool
  default     = true
}

variable "force_destroy" {
  description = "Whether the planned buckets can be destroyed with data inside."
  type        = bool
  default     = false
}

variable "backup_bucket_expiration_days" {
  description = "Number of days before backup objects expire."
  type        = number
  default     = 7
}

variable "tags" {
  description = "Logical tags for the bucket plan."
  type        = map(string)
  default     = {}
}