locals {
  evidence_dir  = "${path.module}/../../../../artifacts/finops"
  evidence_file = "${local.evidence_dir}/state-${var.environment}.json"
}

resource "null_resource" "finops_guardrail" {
  triggers = {
    environment  = var.environment
    release      = var.release
    finops_mode  = var.finops_mode
    owner        = var.tags.owner
    cost_center  = var.tags.cost_center
  }

  provisioner "local-exec" {
    when    = create
    command = "mkdir -p ${local.evidence_dir} && echo '{\"status\":\"${var.finops_mode}\",\"environment\":\"${var.environment}\",\"release\":\"${var.release}\"}' > ${local.evidence_file}"
  }
}

output "finops_evidence" {
  description = "Arquivo com a última execução FinOps"
  value       = local.evidence_file
}
