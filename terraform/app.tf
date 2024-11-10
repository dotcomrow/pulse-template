resource "cloudflare_pages_domain" "app" {
  account_id   = var.cloudflare_account_id
  project_name = var.project_name
  domain       = "${var.project_name}.${var.domain}"
  depends_on = [cloudflare_pages_project.app]
}

resource "cloudflare_record" "app" {
  zone_id         = var.cloudflare_zone_id
  name            = var.project_name
  content           = cloudflare_pages_project.app.domains[0]
  type            = "CNAME"
  ttl             = 3600
  allow_overwrite = true
}

resource "cloudflare_pages_project" "app" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = "prod"
  source {
    type = "github"
    config {
      owner                         = var.org_name
      repo_name                     = var.project_name
      production_branch             = "prod"
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "all"
      preview_branch_excludes       = [ "prod"]
    }
  }

  build_config {
    build_command       = "npm run deploy"
    destination_dir     = ".vercel/output/static"
    build_caching       = true
  }

  deployment_configs {
    production {
        compatibility_flags = ["nodejs_compat"]
        environment_variables = {
          GCP_LOGGING_PROJECT_ID = var.GCP_LOGGING_PROJECT_ID
          LOG_NAME = "${var.project_name}_prod_app_log"
          ENVIRONMENT = "prod"
        }

        secrets = {
          GCP_LOGGING_CREDENTIALS = var.GCP_LOGGING_CREDENTIALS
        }

        d1_databases = {
          CACHE = data.local_file.load_d1_pulse_ui_prod_cache_id.content
        }

        service_binding {
          name = "API"
          service = "api-gateway-prod"
          environment = "production"
        }

        service_binding {
          name = "GRAPHQL"
          service = "pulse-graphql-prod"
          environment = "production"
        }
    }

    preview {
      compatibility_flags = ["nodejs_compat"]
      environment_variables = {
          GCP_LOGGING_PROJECT_ID = var.GCP_LOGGING_PROJECT_ID
          LOG_NAME = "${var.project_name}_dev_app_log"
          ENVIRONMENT = "dev"
        }

        secrets = {
          GCP_LOGGING_CREDENTIALS = var.GCP_LOGGING_CREDENTIALS
        }

        d1_databases = {
          CACHE = data.local_file.load_d1_pulse_ui_dev_cache_id.content
        }

        service_binding {
          name = "API"
          service = "api-gateway-dev"
          environment = "production"
        }

        service_binding {
          name = "GRAPHQL"
          service = "pulse-graphql-dev"
          environment = "production"
        }
    }
  }
}
