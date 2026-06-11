resource "random_id" "suffix" {
  byte_length = 4
}

locals {
  user_pool_name  = trimspace(var.user_pool_name) != "" ? trimspace(var.user_pool_name) : "${var.name_prefix}-cognito-${random_id.suffix.hex}"
  app_client_name = trimspace(var.app_client_name) != "" ? trimspace(var.app_client_name) : "${var.name_prefix}-client-${random_id.suffix.hex}"
  domain_prefix   = trimspace(var.domain_prefix)
}

resource "aws_cognito_user_pool" "this" {
  name = local.user_pool_name

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = false
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  tags = merge(var.tags, {
    Name = local.user_pool_name
  })
}

resource "aws_cognito_user_pool_client" "this" {
  name                                 = local.app_client_name
  user_pool_id                         = aws_cognito_user_pool.this.id
  generate_secret                      = false
  allowed_oauth_flows_user_pool_client = false
  prevent_user_existence_errors        = "ENABLED"
  supported_identity_providers         = ["COGNITO"]
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]
  callback_urls = var.callback_urls
  logout_urls   = var.logout_urls
}

resource "aws_cognito_user_pool_domain" "this" {
  count        = local.domain_prefix != "" ? 1 : 0
  domain       = local.domain_prefix
  user_pool_id = aws_cognito_user_pool.this.id
}