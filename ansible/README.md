# Ansible

This Ansible configuration installs and starts the Docker runtime on the EC2 instances created by Terraform.

## Files

- `ansible.cfg`: default Ansible settings
- `inventory.example.ini`: example inventory using the private IPs from Terraform outputs
- `site.yml`: entry point playbook
- `roles/docker_runtime`: role that installs Docker on Amazon Linux 2023

## Usage

1. Copy `inventory.example.ini` to `inventory.ini`.
2. Replace the placeholder IPs and SSH key path.
3. Run:

```bash
ansible-playbook -i inventory.ini site.yml
```

## Notes

This role is designed for the EC2 instances in this project, which use Amazon Linux 2023.
