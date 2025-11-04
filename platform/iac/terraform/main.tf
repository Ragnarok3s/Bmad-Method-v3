terraform {
  required_version = ">= 1.5.0"
}

locals {
  finops_tags = {
    owner        = var.owner
    cost_center  = var.cost_center
    environment  = var.environment
    service      = var.service
  }
}

module "finops_guardrail" {
  source       = "./modules/finops"
  environment  = var.environment
  release      = var.release
  finops_mode  = var.finops_mode
  tags         = local.finops_tags
  rollback_job = var.rollback_job
}
