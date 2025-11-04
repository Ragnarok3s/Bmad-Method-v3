variable "environment" {
  type = string
}

variable "release" {
  type = string
}

variable "finops_mode" {
  type = string
}

variable "tags" {
  type = object({
    owner       = string
    cost_center = string
    environment = string
    service     = string
  })
}

variable "rollback_job" {
  type    = string
  default = "github-actions"
}
