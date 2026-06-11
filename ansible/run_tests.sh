#!/bin/bash

# Test runner script for Molecule testing
# Usage: ./run_tests.sh [role]

ROLE=${1:-"all"}
MOLECULE_DIR="/home/lucas/Devops/Devops-projet-Lucas-Riyad/ansible/molecule"
WORK_DIR="/home/lucas/Devops/Devops-projet-Lucas-Riyad"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=== Molecule Test Runner ==="

# Check if molecule is available
if ! command -v molecule &> /dev/null; then
    echo -e "${YELLOW}Molecule is not installed. Please install it first.${NC}"
    echo "Install using: pip install molecule molecule-docker --break-system-packages"
    echo "or use the virtual environment approach:"
    echo "  python3 -m venv molecule_venv"
    echo "  source molecule_venv/bin/activate"
    echo "  pip install molecule molecule-docker"
    echo ""
    echo "After installation, make sure molecule is in your PATH."
    exit 1
fi

# Function to run tests for a specific role
run_tests_for_role() {
    local role=$1
    local test_file="${MOLECULE_DIR}/default/tests/test_${role}.yml"
    
    if [ ! -f "$test_file" ]; then
        echo -e "${YELLOW}Test file not found for role: ${role}${NC}"
        return 1
    fi
    
    echo "\n=== Running tests for role: ${role} ==="
    
    # Run molecule test
    if molecule test -s "${role}" -vvv; then
        echo -e "${GREEN}✓ All tests passed for role: ${role}${NC}"
        return 0
    else
        echo -e "${RED}✗ Tests failed for role: ${role}${NC}"
        return 1
    fi
}

# Function to run all tests
run_all_tests() {
    local roles=("common" "app" "backup")
    local failed_roles=()
    
    for role in "${roles[@]}"; do
        if ! run_tests_for_role "$role"; then
            failed_roles+=("$role")
        fi
    done
    
    if [ ${#failed_roles[@]} -eq 0 ]; then
        echo -e "\n${GREEN}=== All tests passed! ===${NC}"
        return 0
    else
        echo -e "\n${RED}=== Tests failed for roles: ${failed_roles[*]} ===${NC}"
        return 1
    fi
}

# Main execution
if [ "$ROLE" = "all" ]; then
    run_all_tests
    exit ${PIPESTATUS[0]}
else
    # Check if the role exists
    if grep -q "^  - name: ${ROLE}" "$MOLECULE_DIR/default/tests/test_${ROLE}.yml" 2>/dev/null; then
        run_tests_for_role "$ROLE"
        exit ${PIPESTATUS[0]}
    else
        echo -e "${RED}Role '${ROLE}' not found or does not have a dedicated test file${NC}"
        echo "Available roles: common, app, backup"
        exit 1
    fi
fi
