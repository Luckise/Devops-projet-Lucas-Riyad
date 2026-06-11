output "user_pool_id" {
  value = aws_cognito_user_pool.this.id
}

output "app_client_id" {
  value = aws_cognito_user_pool_client.this.id
}

output "domain" {
  value = try(aws_cognito_user_pool_domain.this[0].domain, "")
}

output "user_pool_name" {
  value = aws_cognito_user_pool.this.name
}

output "app_client_name" {
  value = aws_cognito_user_pool_client.this.name
}

output "domain_prefix" {
  value = var.domain_prefix
}