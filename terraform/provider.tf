terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }

    acme = {
      source  = "vancluever/acme"
      version = "~> 2.0"
    }
  }
}

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

provider "acme" {
  server_url = "https://acme-v02.api.letsencrypt.org/directory"
}