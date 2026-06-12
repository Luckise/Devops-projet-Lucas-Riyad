output "dns_name" {
  value = aws_lb.this.dns_name
}

output "zone_id" {
  value = aws_lb.this.zone_id
}

output "target_group_arn" {
  value = aws_lb_target_group.this.arn
}

output "name" {
  value = aws_lb.this.name
}

output "subnet_ids" {
  value = var.public_subnet_ids
}

output "target_port" {
  value = var.target_port
}

output "health_check_path" {
  value = var.health_check_path
}