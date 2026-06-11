#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
terraform_dir="$script_dir/../terraform"
inventory_dir="$script_dir/inventory"

instance_ids_json="$(terraform -chdir="$terraform_dir" output -json ec2_instance_ids 2>/dev/null || printf '{}')"
instance_ids="$(printf '%s' "$instance_ids_json" | python3 -c '
import json, sys
payload = json.load(sys.stdin)
if isinstance(payload, dict):
  ids = list(payload.values()) if not payload.get("value") else payload["value"]
elif isinstance(payload, list):
  ids = payload
else:
  ids = []
for iid in ids if isinstance(ids, list) else [ids]:
  print(iid)
' 2>/dev/null || true)"

ecr_json="$(terraform -chdir="$terraform_dir" output -json ecr 2>/dev/null || printf '{}')"
ecr_registry="$(printf '%s' "$ecr_json" | python3 -c '
import json, sys
payload = json.load(sys.stdin)
url = ""
if isinstance(payload, dict):
  url = payload.get("repository_url", "")
elif isinstance(payload, list) and len(payload) > 0:
  url = payload[0].get("repository_url", "")
if url:
  print(url.split("/")[0])
' 2>/dev/null || true)"
ecr_repo_name="$(printf '%s' "$ecr_json" | python3 -c '
import json, sys
payload = json.load(sys.stdin)
name = ""
if isinstance(payload, dict):
  name = payload.get("repository_name", "")
elif isinstance(payload, list) and len(payload) > 0:
  name = payload[0].get("repository_name", "")
if name:
  print(name)
' 2>/dev/null || true)"

ssh_user="${ANSIBLE_SSH_USER:-ubuntu}"
ssm_plugin="${ANSIBLE_SSM_PLUGIN:-/home/lucas/.opencode/bin/session-manager-plugin}"

mkdir -p "$inventory_dir"

{
  echo "all:"
  echo "  children:"
  echo "    app:"
  if [ -n "$instance_ids" ]; then
    echo "      hosts:"
    printf '%s\n' "$instance_ids" | while IFS= read -r iid; do
      printf '        %s:\n' "$iid"
      printf '          ansible_host: %s\n' "$iid"
      printf '          ansible_user: %s\n' "$ssh_user"
      printf '          ansible_connection: aws_ssm\n'
      if [ -n "$ssm_plugin" ]; then
        printf '          ansible_aws_ssm_plugin: %s\n' "$ssm_plugin"
      fi
    done
  else
    echo "      hosts: {}"
  fi
} > "$inventory_dir/hosts.yml"

vars_dir="$inventory_dir/group_vars/all"
mkdir -p "$vars_dir"

if [ -n "$ecr_registry" ] && [ -n "$ecr_repo_name" ]; then
  cat > "$vars_dir/ecr.yml" <<VARS
---
ecr_registry: "$ecr_registry"
ecr_repository_name: "$ecr_repo_name"
VARS
  echo "Generated ECR vars: $vars_dir/ecr.yml"
fi

buckets_json="$(terraform -chdir="$terraform_dir" output -json buckets 2>/dev/null || printf '{}')"
assets_bucket="$(printf '%s' "$buckets_json" | python3 -c '
import json, sys
payload = json.load(sys.stdin)
if isinstance(payload, dict):
  print(payload.get("assets", ""))
elif isinstance(payload, list) and len(payload) > 0:
  print(payload[0].get("assets", ""))
' 2>/dev/null || true)"
if [ -n "$assets_bucket" ]; then
  aws_region="$(terraform -chdir="$terraform_dir" output -json terraform_plan_summary 2>/dev/null | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("region", "eu-west-3"))' 2>/dev/null || echo "eu-west-3")"
  cat > "$vars_dir/ssm.yml" <<VARS
---
ansible_aws_ssm_region: "$aws_region"
ansible_aws_ssm_bucket_name: "$assets_bucket"
ansible_remote_tmp: /tmp/ansible
VARS
  echo "Generated SSM bucket var: $vars_dir/ssm.yml"
fi
