locals {
  app_domain_name  = var.app_domain_name != "" ? var.app_domain_name : "${var.project_name}-${var.environment}.example.com"
}

resource "aws_acm_certificate" "app" {
  domain_name               = local.app_domain_name
  subject_alternative_names = var.subject_alternative_names
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_zone" "app" {
  name = local.app_domain_name
  tags = merge(var.tags, {
    Name = local.app_domain_name
  })
}

resource "aws_route53_record" "app" {
  for_each = {
    for dvo in aws_acm_certificate.app.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  type            = each.value.type
  zone_id         = aws_route53_zone.app.zone_id
}

resource "aws_acm_certificate_validation" "app" {
  certificate_arn         = aws_acm_certificate.app.arn
  validation_record_fqdns = [for record in aws_route53_record.app : record.fqdn]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "alb_http" {
  zone_id = aws_route53_zone.app.zone_id
  name    = "www"
  type    = "A"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "alb_https" {
  count  = var.enable_https ? 1 : 0
  zone_id = aws_route53_zone.app.zone_id
  name    = "secure"
  type    = "A"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "alb_wildcard" {
  count  = var.enable_https ? 1 : 0
  zone_id = aws_route53_zone.app.zone_id
  name    = "*."
  type    = "A"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}

output "app_domain_name" {
  value = local.app_domain_name
}

output "route53_zone_id" {
  value = aws_route53_zone.app.zone_id
}

output "acm_certificate_arn" {
  value = aws_acm_certificate.app.arn
}

output "alb_dns_name" {
  value = var.alb_dns_name
}

output "alb_zone_id" {
  value = var.alb_zone_id
}
