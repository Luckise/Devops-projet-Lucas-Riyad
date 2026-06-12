output "instance_ids" {
  value = [for instance in aws_instance.this : instance.id]
}

output "public_ips" {
  value = [for instance in aws_instance.this : instance.public_ip]
}

output "private_ips" {
  value = [for instance in aws_instance.this : instance.private_ip]
}

output "instance_profile_name" {
  value = aws_iam_instance_profile.this.name
}

output "role_arn" {
  value = aws_iam_role.this.arn
}

output "name_prefix" {
  value = var.name_prefix
}

output "instance_count" {
  value = var.instance_count
}

output "instance_type" {
  value = var.instance_type
}

output "subnet_cidrs" {
  value = var.subnet_ids
}