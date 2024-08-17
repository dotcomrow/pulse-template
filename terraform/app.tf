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

resource "cloudflare_r2_bucket" "prod-cache" {
  account_id = var.cloudflare_account_id
  name       = "${var.project_name}-prod-cache"
}

resource "cloudflare_r2_bucket" "dev-cache" {
  account_id = var.cloudflare_account_id
  name       = "${var.project_name}-dev-cache"
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
    build_command       = "export NODE_OPTIONS=--max_old_space_size=16384 && npm install && npx @cloudflare/next-on-pages@latest"
    destination_dir     = ".vercel/output/static"
    build_caching       = true
  }

  deployment_configs {
    production {
        compatibility_flags = ["nodejs_compat"]
        environment_variables = {
          GCP_LOGGING_PROJECT_ID = var.GCP_LOGGING_PROJECT_ID
          LOG_NAME = "${var.project_name}_prod_app_log"
        }

        secrets = {
          GCP_LOGGING_CREDENTIALS = var.GCP_LOGGING_CREDENTIALS
        }

        r2_buckets = {
          CACHE = "${var.project_name}-prod-cache"
        }

        service_binding {
          name = "API"
          service = "api-gateway-prod"
        }

        service_binding {
          name = "GRAPHQL"
          service = "pulse-graphql-prod"
        }
    }

    preview {
      compatibility_flags = ["nodejs_compat"]
      environment_variables = {
          GCP_LOGGING_PROJECT_ID = var.GCP_LOGGING_PROJECT_ID
          LOG_NAME = "${var.project_name}_dev_app_log"
        }

        secrets = {
          GCP_LOGGING_CREDENTIALS = var.GCP_LOGGING_CREDENTIALS
        }

        r2_buckets = {
          CACHE = "${var.project_name}-dev-cache"
        }

        service_binding {
          name = "API"
          service = "api-gateway-dev"
        }

        service_binding {
          name = "GRAPHQL"
          service = "pulse-graphql-dev"
        }
    }
  }
}
