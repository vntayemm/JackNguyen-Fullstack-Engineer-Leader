#!/bin/bash




FILES=(
  "test_sample_(to be email-attached for assessment).py"
  "FULLSTACK Engineer Test Brief (2025).pdf"
)

for file in "${FILES[@]}"; do
  git filter-branch --force --index-filter "git rm --cached --ignore-unmatch '$file'" --prune-empty --tag-name-filter cat -- --all
done

rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "✅ Files removed from history. Remember to force push:"
echo "   git push --force --all"
