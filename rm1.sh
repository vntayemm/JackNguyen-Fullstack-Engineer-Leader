#!/bin/bash

# STOP IF README.md is tracked
if git ls-files | grep -q "README.md"; then
  echo "❌ README.md is tracked. Deleting it..."
  git rm README.md
  rm -f README.md
else
  echo "✅ README.md not found in tracked files"
fi

# Clean working tree
git add -A
git commit -m "Clean slate: remove README.md and reset history"

# Create a fresh orphan branch
git checkout --orphan TEMP_BRANCH

# Add all files to the new branch
git add -A
git commit -m "🎉 Initial clean commit (README.md removed)"

# Delete old branch and rename
git branch -D main
git branch -m main

# Force push to GitHub
git push origin --force --set-upstream main

echo "✅ Repo is reset. README.md is removed from history and HEAD."
