provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile != "" ? var.aws_profile : null

  default_tags {
    tags = merge(var.common_tags, {
      project     = var.project_name
      environment = var.environment
      managed-by  = "terraform"
    })
  }
}