resource "random_id" "suffix" {
  byte_length = 4
}

resource "random_password" "master" {
  length           = 20
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

locals {
  identifier = trimspace(var.identifier) != "" ? trimspace(var.identifier) : "${var.name_prefix}-db-${random_id.suffix.hex}"
}

resource "aws_db_subnet_group" "this" {
  name       = "${local.identifier}-subnets"
  subnet_ids = var.subnet_ids

  tags = merge(var.tags, {
    Name = "${local.identifier}-subnets"
  })
}

resource "aws_db_parameter_group" "this" {
  name   = "${local.identifier}-pg"
  family = "postgres16"

  tags = merge(var.tags, {
    Name = "${local.identifier}-pg"
  })
}

resource "aws_db_instance" "this" {
  identifier                 = local.identifier
  engine                     = var.engine
  engine_version             = var.engine_version
  instance_class             = var.instance_class
  allocated_storage          = var.allocated_storage
  db_name                    = var.db_name
  username                   = var.username
  password                   = random_password.master.result
  port                       = var.port
  db_subnet_group_name       = aws_db_subnet_group.this.name
  vpc_security_group_ids     = var.security_group_ids
  parameter_group_name       = aws_db_parameter_group.this.name
  publicly_accessible        = false
  storage_encrypted          = true
  backup_retention_period    = min(var.backup_retention_days, 1)
  skip_final_snapshot        = true
  deletion_protection        = var.deletion_protection
  apply_immediately          = true
  multi_az                   = false
  auto_minor_version_upgrade = true

  tags = merge(var.tags, {
    Name = local.identifier
  })
}