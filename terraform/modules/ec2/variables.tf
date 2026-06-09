variable "name_prefix" {
  description = "Prefix used to derive EC2 instance names."
  type        = string
}

variable "instance_count" {
  description = "Number of application instances planned."
  type        = number
}

variable "instance_type" {
  description = "Instance type planned for the application tier."
  type        = string
}

variable "subnet_cidrs" {
  description = "Subnets reserved for the application tier."
  type        = list(string)
}

variable "security_group_names" {
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

variable "tags" {
  description = "Logical tags for the application tier plan."
  type        = map(string)
  default     = {}
}