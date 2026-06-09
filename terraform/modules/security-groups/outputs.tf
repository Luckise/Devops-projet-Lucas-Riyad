output "alb_security_group_name" {
  value = "${var.name_prefix}-alb"
}

output "app_security_group_name" {
  value = "${var.name_prefix}-app"
}

output "db_security_group_name" {
  value = "${var.name_prefix}-db"
}