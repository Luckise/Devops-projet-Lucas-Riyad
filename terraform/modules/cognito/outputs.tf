output "user_pool_id" {
  value = aws_cognito_user_pool.this.id
}

output "app_client_id" {
  value = aws_cognito_user_pool_client.this.id
}

output "user_pool_name" {
  value = aws_cognito_user_pool.this.name
}

output "app_client_name" {
  value = aws_cognito_user_pool_client.this.name
}
