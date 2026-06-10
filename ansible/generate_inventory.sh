#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
terraform_dir="$script_dir/../terraform"
inventory_dir="$script_dir/inventory"

output_json="$(terraform -chdir="$terraform_dir" output -json ec2_app_ips 2>/dev/null || printf '{}')"
hosts="$(OUTPUT_JSON="$output_json" python3 -c 'import json, os
payload = json.loads(os.environ["OUTPUT_JSON"])
if isinstance(payload, dict):
  hosts = payload.get("value", []) or []
else:
  hosts = payload or []
for host in hosts:
  print(host)
')"
ssh_user="${ANSIBLE_SSH_USER:-ubuntu}"

mkdir -p "$inventory_dir"

{
  echo "all:"
  echo "  children:"
  echo "    app:"
  if [ -n "$hosts" ]; then
    echo "      hosts:"
    printf '%s\n' "$hosts" | while IFS= read -r host; do
      printf '        %s:\n' "$host"
      printf '          ansible_host: %s\n' "$host"
      printf '          ansible_user: %s\n' "$ssh_user"
    done
  else
    echo "      hosts: {}"
  fi
} > "$inventory_dir/hosts.yml"
