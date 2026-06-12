locals {
  alb_name = trimspace(var.name) != "" ? trimspace(var.name) : "${var.name_prefix}-alb"
}

resource "aws_lb" "this" {
  name               = local.alb_name
  load_balancer_type = "application"
  internal           = false
  security_groups    = var.security_group_ids
  subnets            = var.public_subnet_ids

  tags = merge(var.tags, {
    Name = local.alb_name
  })
}

resource "aws_lb_target_group" "this" {
  name        = substr("${local.alb_name}-tg", 0, 32)
  port        = var.target_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    path                = var.health_check_path
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher             = "200-399"
  }

  tags = merge(var.tags, {
    Name = "${local.alb_name}-tg"
  })
}

resource "aws_lb_target_group_attachment" "this" {
  count = length(var.target_instance_ids)

  target_group_arn = aws_lb_target_group.this.arn
  target_id        = var.target_instance_ids[count.index]
  port             = var.target_port
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = var.enable_https ? "redirect" : "forward"
    target_group_arn = var.enable_https ? null : aws_lb_target_group.this.arn

    dynamic "redirect" {
      for_each = var.enable_https ? [1] : []
      content {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
  }
}

resource "aws_lb_listener" "https" {
  count             = var.enable_https ? 1 : 0
  load_balancer_arn = aws_lb.this.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = var.certificate_arn
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }
}