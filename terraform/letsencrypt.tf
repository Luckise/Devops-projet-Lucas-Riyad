resource "tls_private_key" "acme" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "acme_registration" "this" {
  account_key_pem = tls_private_key.acme.private_key_pem
  email_address   = "lucas.guillemin@efrei.net"
}

resource "acme_certificate" "this" {
  account_key_pem           = acme_registration.this.account_key_pem
  common_name               = "${var.duckdns_subdomain}.duckdns.org"
  subject_alternative_names = []

  dns_challenge {
    provider = "duckdns"

    config = {
      DUCKDNS_TOKEN = var.duckdns_token
    }
  }

  depends_on = [acme_registration.this]
}

resource "aws_acm_certificate" "this" {
  private_key       = acme_certificate.this.private_key_pem
  certificate_body  = acme_certificate.this.certificate_pem
  certificate_chain = acme_certificate.this.issuer_pem

  tags = merge(local.tags, {
    Name = "${local.resource_prefix}-letsencrypt-cert"
  })
}
