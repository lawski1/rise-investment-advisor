#!/bin/bash

# Complete setup script: Authenticate GitHub CLI, create repo, and push code
# Repository: rise-investment-advisor
# GitHub user: lawski1

set -e

REPO_NAME="rise-investment-advisor"
GITHUB_USER="lawski1"
REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}"

echo "🚀 GitHub Repository Setup for Rise Investment Advisor"
echo "=================================================="
echo ""

# Step 1: Check GitHub CLI authentication
echo "Step 1: Checking GitHub CLI authentication..."
if gh auth status &> /dev/null; then
    echo "✅ Already authenticated with GitHub CLI"
    AUTHENTICATED=true
else
    echo "⚠️  Not authenticated. Starting authentication process..."
    echo ""
    echo "Please choose authentication method:"
    echo "1. Browser (recommended - opens browser for login)"
    echo "2. Token (paste a personal access token)"
    echo ""
    read -p "Enter choice (1 or 2): " auth_choice
    
    if [ "$auth_choice" = "1" ]; then
        echo "🌐 Opening browser for authentication..."
        gh auth login --web
    elif [ "$auth_choice" = "2" ]; then
        echo "Please create a token at: https://github.com/settings/tokens"
        echo "Required scopes: repo (full control)"
        read -p "Paste your token: " token
        echo "$token" | gh auth login --with-token
    else
        echo "❌ Invalid choice. Exiting."
        exit 1
    fi
    
    # Verify authentication
    if gh auth status &> /dev/null; then
        echo "✅ Authentication successful!"
        AUTHENTICATED=true
    else
        echo "❌ Authentication failed. Please try again."
        exit 1
    fi
fi

echo ""
echo "Step 2: Creating GitHub repository..."

# Check if repository already exists
if gh repo view ${GITHUB_USER}/${REPO_NAME} &> /dev/null; then
    echo "⚠️  Repository already exists: ${REPO_URL}"
    echo "🔄 Setting remote and pushing code..."
    git remote set-url origin git@github.com:${GITHUB_USER}/${REPO_NAME}.git 2>/dev/null || \
    git remote add origin git@github.com:${GITHUB_USER}/${REPO_NAME}.git
else
    echo "📦 Creating new repository: ${REPO_NAME}..."
    gh repo create ${REPO_NAME} \
        --public \
        --description "Investment research and recommendation platform for index funds, ETFs, and S&P 500" \
        --source=. \
        --remote=origin \
        --push
    
    echo "✅ Repository created successfully!"
fi

echo ""
echo "Step 3: Pushing code to GitHub..."

# Ensure we're on main branch
git branch -M main 2>/dev/null || true

# Push to GitHub
if git push -u origin main 2>&1; then
    echo "✅ Code pushed successfully!"
else
    echo "⚠️  Push failed. Trying to set upstream..."
    git push --set-upstream origin main
fi

echo ""
echo "=================================================="
echo "🎉 SUCCESS! Your code is now on GitHub!"
echo ""
echo "📦 Repository: ${REPO_URL}"
echo ""
echo "📖 Next Steps:"
echo "   1. Visit your repository: ${REPO_URL}"
echo "   2. Deploy to Vercel (recommended):"
echo "      - Go to https://vercel.com"
echo "      - Sign in with GitHub"
echo "      - Import repository: ${REPO_NAME}"
echo "      - Click Deploy (auto-detects Next.js!)"
echo ""
echo "   3. Or enable GitHub Pages:"
echo "      - Go to repository Settings → Pages"
echo "      - Source: GitHub Actions"
echo ""
echo "✨ Happy coding!"

