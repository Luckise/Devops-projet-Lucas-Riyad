# Molecule Testing Setup

This directory contains Molecule test scenarios for testing Ansible roles in containerized environments.

## Overview

Molecule provides a framework for testing Ansible roles across multiple distributions and scenarios. This setup creates isolated container environments to test Ansible roles without affecting your production systems.

## Test Structure

```
ansible/
├── molecule.yml              # Main Molecule configuration
├── molecule/
│   └── default/
│       ├── tests/           # Test scenarios
│       │   ├── test_common.yml      # Tests for common role
│       │   ├── test_app.yml         # Tests for app role
│       │   └── test_backup.yml      # Tests for backup role
│       └── playbooks/          # Ansible playbooks for testing
└── run_tests.sh              # Test runner script
```

## Requirements

- Python 3.6+
- Docker
- Molecule (`pip install molecule molecule-docker`)

## Running Tests

### Run All Tests

```bash
ansible/run_tests.sh
```

### Run Tests for a Specific Role

```bash
ansible/run_tests.sh common
ansible/run_tests.sh app
ansible/run_tests.sh backup
```

### Run Molecule Directly

```bash
cd ansible
molecule test -s common -vvv
molecule test -s app -vvv
molecule test -s backup -vvv
```

## Test Scenarios

### common Role Tests

The `common` role tests cover:
- Package installation (curl, unzip, ca-certificates)
- Docker installation and service management
- AWS CLI installation
- User and group creation
- Systemd service management
- AWS credentials setup

### app Role Tests

The `app` role tests cover:
- Application directory creation
- ECR image operations
- Systemd unit setup

### backup Role Tests

The `backup` role tests cover:
- Backup directory creation
- Backup script setup
- Cron job configuration

## Test Matrix

The test matrix includes multiple Linux distributions:

```yaml
instance_names:
  - alpine3    # Alpine Linux 3.x
  - centos7    # CentOS 7
  - ubuntu2004  # Ubuntu 20.04
```

## Test Isolation

Each test scenario runs in an isolated Docker container, ensuring:
- No interference between test scenarios
- Clean state for each test
- Consistent testing environment

## Test Tags

Molecule tests can be tagged for selective execution:

```bash
# Run only package installation tests
molecule test -s common -t package-installation

# Run only Docker tests
molecule test -s common -t docker-installation

# Run only user/group tests
molecule test -s common -t user-creation
```

## Test Reports

Molecule generates detailed test reports including:
- Test execution logs
- Resource usage information
- Failure details
- Performance metrics

Reports are stored in the `molecule/default/` directory.

## Best Practices

### Test Design

1. **Keep tests focused**: Each test should have a single clear purpose
2. **Use descriptive names**: Test names should clearly indicate what is being tested
3. **Test edge cases**: Include tests for error conditions and boundary cases
4. **Clean up resources**: Ensure tests clean up after themselves

### Test Maintenance

1. **Document assumptions**: Clearly document any assumptions made in tests
2. **Regular updates**: Update tests when roles change
3. **Mock external dependencies**: Mock external services (databases, APIs) when testing
4. **Use test variables**: Use role variables to control test behavior

### Performance

1. **Use caching**: Leverage Ansible's built-in caching
2. **Skip unnecessary steps**: Skip tests that are not relevant to the scenario
3. **Parallel execution**: Use Molecule's parallel execution for faster tests

## Troubleshooting

### Common Issues

1. **Docker not available**: Ensure Docker is installed and running
2. **Molecule version mismatch**: Use compatible versions of Molecule and Ansible
3. **Permission issues**: Run tests with appropriate privileges

### Getting Help

1. Check Molecule documentation: https://molecule.readthedocs.io/
2. Review test logs in the `molecule/default/` directory
3. Look at the role documentation for expected behavior

## License

This testing setup is provided under the same license as the Ansible roles.
