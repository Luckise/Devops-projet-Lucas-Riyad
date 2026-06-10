output "alb_security_group_id" {
  value = aws_security_group.alb.id
}

output "app_security_group_id" {
  value = aws_security_group.app.id
}

output "db_security_group_id" {
  value = aws_security_group.db.id
}

output "alb_security_group_name" {
  value = aws_security_group.alb.name
}

output "app_security_group_name" {
  value = aws_security_group.app.name
}

output "db_security_group_name" {
  value = aws_security_group.db.name
}