variable "name_prefix" {
  description = "Prefix used to derive EC2 instance names."
  type        = string
}

variable "instance_count" {
  description = "Number of application instances planned."
  type        = number
  default     = 1
}

variable "instance_type" {
  description = "Instance type planned for the application tier."
  type        = string
  default     = "t3.micro"
}

variable "subnet_ids" {
  description = "Subnets reserved for the application tier."
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security groups planned for the application tier."
  type        = list(string)
}

variable "ami_id" {
  description = "AMI identifier planned for the application tier."
  type        = string
  default     = ""
}

variable "key_pair_name" {
  description = "SSH key pair name planned for the application tier."
  type        = string
  default     = ""
}

variable "ssh_cidr_blocks" {
  description = "CIDR blocks allowed to SSH into the application tier."
  type        = list(string)
  default     = []
}

variable "user_data" {
  description = "User data planned for the application instances."
  type        = string
  default     = ""
}

variable "s3_bucket_arns" {
  description = "S3 bucket ARNs available to the application instances."
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Logical tags for the application tier plan."
  type        = map(string)
  default     = {}
}