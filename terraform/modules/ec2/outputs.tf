output "private_ips" {
  value = [for instance in aws_instance.this : instance.private_ip]
}
