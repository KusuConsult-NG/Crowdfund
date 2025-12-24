#!/bin/bash
# Script to remove .env from Git history
# WARNING: This rewrites Git history - coordinate with your team first!

echo "🚨 REMOVING .env FROM GIT HISTORY"
echo "This will rewrite Git history. Make sure you have a backup!"
echo ""
read -p "Have you rotated all API keys? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Please rotate your API keys first!"
    exit 1
fi

echo "Removing .env from Git history..."

# Use git filter-repo (recommended) or filter-branch
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

echo "✅ .env removed from history"
echo ""
echo "⚠️ NEXT STEPS:"
echo "1. Verify the changes: git log --all --full-history -- .env"
echo "2. Force push: git push origin --force --all"
echo "3. Force push tags: git push origin --force --tags"
echo ""
echo "⚠️ WARNING: Team members will need to re-clone the repository!"
