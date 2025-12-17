#!/bin/bash

# Automated GitHub setup: Authenticate and create repository
# Uses browser authentication (non-interactive for auth method)

set -e

REPO_NAME="rise-investment-advisor"
GITHUB_USER="lawski1"
REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}"

echo "🚀 Automated GitHub Repository Setup"
echo "======================================"
echo ""

# Step 1: Authenticate (if needed)
if ! gh auth status &> /dev/null; then
    echo "Step 1: Authenticating with GitHub..."
    echo "📱 This will open your browser for authentication"
    echo "   Please complete the login in your browser"
    echo ""
    gh auth login --web --git-protocol ssh
    echo ""
fi

echo "✅ Authenticated with GitHub"
echo ""

# Step 2: Create repository
echo "Step 2: Creating repository '${REPO_NAME}'..."

# Check if repo exists
if gh repo view ${GITHUB_USER}/${REPO_NAME} &> /dev/null; then
    echo "⚠️  Repository already exists"
    git remote set-url origin git@github.com:${GITHUB_USER}/${REPO_NAME}.git 2>/dev/null || \
    git remote add origin git@github.com:${GITHUB_USER}/${REPO_NAME}.git
else
    # Create repository
    gh repo create ${REPO_NAME} \
        --public \
        --description "Investment research and recommendation platform for index funds, ETFs, and S&P 500" \
        --source=. \
        --remote=origin
    
    echo "✅ Repository created: ${REPO_URL}"
fi

echo ""

# Step 3: Push code
echo "Step 3: Pushing code to GitHub..."
git branch -M main 2>/dev/null || true

if git push -u origin main 2>&1; then
    echo "✅ Code pushed successfully!"
else
    echo "⚠️  First push attempt failed, retrying..."
    git push --set-upstream origin main || {
        echo "❌ Push failed. Please check:"
        echo "   1. Repository exists on GitHub"
        echo "   2. You have push access"
        exit 1
    }
fi

echo ""
echo "======================================"
echo "🎉 SUCCESS!"
echo ""
echo "📦 Repository: ${REPO_URL}"
echo ""
echo "📖 Next: Deploy to Vercel at https://vercel.com"
echo "   (Import repository and click Deploy)"

