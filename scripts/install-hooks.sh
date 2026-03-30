#!/bin/sh
# Install git hooks from the scripts/ directory.
# Run once after cloning: sh scripts/install-hooks.sh

REPO_ROOT="$(git rev-parse --show-toplevel)"

cp "$REPO_ROOT/scripts/pre-commit" "$REPO_ROOT/.git/hooks/pre-commit"
chmod +x "$REPO_ROOT/.git/hooks/pre-commit"

echo "Installed pre-commit hook."
