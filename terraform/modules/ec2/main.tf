data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

resource "aws_instance" "this" {
  count = 2

  ami                         = data.aws_ami.amazon_linux_2023.id
  instance_type               = var.instance_type
  subnet_id                   = var.private_app_subnet_ids[count.index]
  vpc_security_group_ids      = [var.ec2_security_group_id]
  associate_public_ip_address = false

  user_data = <<-EOF
              #!/bin/bash
              set -eux
              dnf update -y
              dnf install -y nginx

              cat > /etc/nginx/conf.d/default.conf <<'NGINX'
              server {
                listen 80;

                location / {
                  return 200 'ok';
                  add_header Content-Type text/plain;
                }
              }
              NGINX

              systemctl enable nginx
              systemctl restart nginx
              EOF

  tags = {
    Name = "${var.name_prefix}-ec2-${count.index + 1}"
  }
}

resource "aws_lb_target_group_attachment" "this" {
  count = 2

  target_group_arn = var.target_group_arn
  target_id        = aws_instance.this[count.index].id
  port             = 80
}
