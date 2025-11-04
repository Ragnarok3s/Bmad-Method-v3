variable "environment" {
  type        = string
  description = "Ambiente alvo do deploy"
}

variable "release" {
  type        = string
  description = "Identificador do release em execução"
}

variable "finops_mode" {
  type        = string
  description = "Modo de execução (rollback, tagging, validate)"
  validation {
    condition     = contains(["rollback", "tagging", "validate"], var.finops_mode)
    error_message = "finops_mode deve ser rollback, tagging ou validate"
  }
}

variable "owner" {
  type        = string
  description = "Owner responsável pelo recurso"
  default     = "squad-platform"
}

variable "cost_center" {
  type        = string
  description = "Centro de custo associado"
  default     = "PLT01"
}

variable "service" {
  type        = string
  description = "Serviço associado ao deploy"
  default     = "bmad-method"
}

variable "rollback_job" {
  type        = string
  description = "Nome do job de rollback automatizado"
  default     = "github-actions"
}
