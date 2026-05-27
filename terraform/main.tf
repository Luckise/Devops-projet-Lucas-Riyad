provider "aws" {
  region = var.aws_region
}

module "network" {
  source = "./modules/network"

  name_prefix              = var.project_name
  vpc_cidr                 = var.vpc_cidr
  public_subnet_cidrs      = var.public_subnet_cidrs
  private_app_subnet_cidrs = var.private_app_subnet_cidrs
  private_db_subnet_cidrs  = var.private_db_subnet_cidrs
}

module "security_groups" {
  source = "./modules/security-groups"

  name_prefix = var.project_name
  vpc_id      = module.network.vpc_id
}

module "alb" {
  source = "./modules/alb"

  name_prefix            = var.project_name
  vpc_id                 = module.network.vpc_id
  public_subnet_ids      = module.network.public_subnet_ids
  alb_security_group_id  = module.security_groups.alb_sg_id
  alb_certificate_arn    = var.alb_certificate_arn
}

module "ec2" {
  source = "./modules/ec2"

  name_prefix           = var.project_name
  instance_type         = var.ec2_instance_type
  private_app_subnet_ids = module.network.private_app_subnet_ids
  ec2_security_group_id = module.security_groups.ec2_sg_id
  target_group_arn      = module.alb.target_group_arn
}

module "rds" {
  source = "./modules/rds"

  name_prefix           = var.project_name
  private_db_subnet_ids = module.network.private_db_subnet_ids
  rds_security_group_id = module.security_groups.rds_sg_id
  instance_class        = var.rds_instance_class
  engine_version        = var.rds_engine_version
  db_name               = var.rds_db_name
  username              = var.rds_username
  password              = var.rds_password
}

module "ecs" {
  source = "./modules/ecs"

  name_prefix           = var.project_name
  aws_region            = var.aws_region
  private_app_subnet_ids = module.network.private_app_subnet_ids
  ecs_security_group_id = module.security_groups.ecs_sg_id
  container_image       = var.ecs_container_image
}
