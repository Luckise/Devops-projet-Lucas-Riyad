resource "random_id" "suffix" {
  byte_length = 4
}

locals {
  user_pool_name  = trimspace(var.user_pool_name) != "" ? trimspace(var.user_pool_name) : "${var.name_prefix}-cognito-${random_id.suffix.hex}"
  app_client_name = trimspace(var.app_client_name) != "" ? trimspace(var.app_client_name) : "${var.name_prefix}-client-${random_id.suffix.hex}"
  domain_prefix   = trimspace(var.domain_prefix)
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
    "ALLOW_USER_SRP_AUTH"
  ]
  callback_urls = var.callback_urls
  logout_urls   = var.logout_urls
}

resource "aws_cognito_user_group" "admin" {
  name         = "Admin"
  user_pool_id = aws_cognito_user_pool.this.id
  description  = "Administrator group with event creation privileges"
}

resource "aws_cognito_user_group" "non_admin" {
  name         = "Non-admin"
  user_pool_id = aws_cognito_user_pool.this.id
  description  = "Regular users without administrative privileges"
}

resource "aws_cognito_user_pool_domain" "this" {
  count        = local.domain_prefix != "" ? 1 : 0
  domain       = local.domain_prefix
  user_pool_id = aws_cognito_user_pool.this.id
}

data "archive_file" "post_confirmation_lambda" {
  type        = "zip"
  source_file = "${path.module}/lambda/post_confirmation.py"
  output_path = "${path.module}/lambda/post_confirmation.zip"
}

resource "aws_iam_role" "post_confirmation" {
  name = "${var.name_prefix}-post-confirmation"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_policy" "post_confirmation" {
  name = "${var.name_prefix}-post-confirmation"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["cognito-idp:AdminAddUserToGroup"]
      Resource = aws_cognito_user_pool.this.arn
    }]
  })
}

resource "aws_iam_role_policy_attachment" "post_confirmation" {
  role       = aws_iam_role.post_confirmation.name
  policy_arn = aws_iam_policy.post_confirmation.arn
}

resource "aws_lambda_function" "post_confirmation" {
  filename         = data.archive_file.post_confirmation_lambda.output_path
  source_code_hash = data.archive_file.post_confirmation_lambda.output_base64sha256
  function_name    = "${var.name_prefix}-post-confirmation"
  role             = aws_iam_role.post_confirmation.arn
  handler          = "post_confirmation.handler"
  runtime          = "python3.12"
  timeout          = 10
}

resource "aws_lambda_permission" "post_confirmation" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.post_confirmation.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.this.arn
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

  lambda_config {
    post_confirmation = aws_lambda_function.post_confirmation.arn
  }

  tags = merge(var.tags, {
    Name = local.user_pool_name
  })
}