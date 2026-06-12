output "endpoint" {
  value = aws_db_instance.this.address
}

output "port" {
  value = aws_db_instance.this.port
}

output "username" {
  value = aws_db_instance.this.username
}

output "password" {
  value     = random_password.master.result
  sensitive = true
}

output "identifier" {
  value = aws_db_instance.this.identifier
}

output "db_name" {
  value = aws_db_instance.this.db_name
}

output "engine" {
  value = aws_db_instance.this.engine
}

output "engine_version" {
  value = aws_db_instance.this.engine_version
}