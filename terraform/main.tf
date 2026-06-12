locals {
  resource_prefix = "${var.project_name}-${var.environment}"

  tags = merge(var.common_tags, {
    project     = var.project_name
    environment = var.environment
    managed-by  = "terraform"
  })
}

module "vpc" {
  source = "./modules/vpc"

  name                 = local.resource_prefix
  cidr_block           = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones   = var.availability_zones
  tags                 = local.tags
}

module "security_groups" {
  source = "./modules/security-groups"

  name_prefix       = var.security_group_name_prefix
  vpc_id            = module.vpc.vpc_id
  vpc_cidr          = var.vpc_cidr
  admin_cidr_blocks = var.admin_cidr_blocks
  app_port          = var.app_container_port
  db_port           = 5432
  alb_port          = 443
}

module "s3" {
  source = "./modules/s3"

  name_prefix        = local.resource_prefix
  asset_bucket_name  = var.asset_bucket_name
  backup_bucket_name = var.backup_bucket_name
  versioning_enabled = true
  force_destroy      = false
  tags               = local.tags
}

module "cognito" {
  source = "./modules/cognito"

  name_prefix     = local.resource_prefix
  user_pool_name  = var.cognito_user_pool_name
  app_client_name = var.cognito_app_client_name
  domain_prefix   = ""
  callback_urls   = []
  logout_urls     = []
  tags            = local.tags
}

module "rds" {
  source = "./modules/rds"

  name_prefix           = local.resource_prefix
  vpc_id                = module.vpc.vpc_id
  identifier            = var.rds_identifier
  db_name               = var.rds_db_name
  engine                = var.rds_engine
  engine_version        = var.rds_engine_version
  instance_class        = var.rds_instance_class
  subnet_ids            = module.vpc.private_subnet_ids
  security_group_ids    = [module.security_groups.db_security_group_id]
  allocated_storage     = var.rds_allocated_storage
  backup_retention_days = var.rds_backup_retention_days
  tags                  = local.tags
}

module "ec2" {
  source = "./modules/ec2"

  name_prefix        = local.resource_prefix
  instance_count     = var.ec2_instance_count
  instance_type      = var.ec2_instance_type
  subnet_ids         = module.vpc.public_subnet_ids
  security_group_ids = [module.security_groups.app_security_group_id]
  ami_id             = var.ec2_ami_id
  key_pair_name      = var.ec2_key_pair_name
  ssh_cidr_blocks    = var.admin_cidr_blocks
  user_data          = ""
  s3_bucket_arns     = [module.s3.asset_bucket_arn, module.s3.backup_bucket_arn]
  tags               = local.tags
}

module "ecr" {
  source = "./modules/ecr"

  name_prefix      = local.resource_prefix
  repository_name  = var.ecr_repository_name
  tags             = local.tags
}

module "alb" {
  source = "./modules/alb"

  name_prefix         = local.resource_prefix
  name                = var.alb_name
  vpc_id              = module.vpc.vpc_id
  public_subnet_ids   = module.vpc.public_subnet_ids
  security_group_ids  = [module.security_groups.alb_security_group_id]
  target_instance_ids = module.ec2.instance_ids
  certificate_arn     = var.enable_https ? aws_acm_certificate.this.arn : ""
  enable_https        = var.enable_https
  target_port         = var.app_container_port
  health_check_path   = var.app_health_check_path
  tags                = local.tags
}