#!/bin/bash

# Script to create GitHub repository and push code
# Repository: rise-investment-advisor
# GitHub user: lawski1

set -e

REPO_NAME="rise-investment-advisor"
GITHUB_USER="lawski1"
REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}"

echo "🚀 Creating GitHub repository and pushing code..."
echo ""

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI found. Using gh to create repository..."
    
    # Check if authenticated
    if gh auth status &> /dev/null; then
        echo "✅ GitHub CLI authenticated"
        
        # Create repository
        echo "📦 Creating repository: ${REPO_NAME}..."
        gh repo create ${REPO_NAME} --public --source=. --remote=origin --push 2>&1 || {
            echo "⚠️  Repository might already exist or there was an error"
            echo "🔄 Trying to push to existing repository..."
            git push -u origin main
        }
        
        echo ""
        echo "✅ Success! Repository created and code pushed!"
        echo "🌐 View your repository at: ${REPO_URL}"
        
    else
        echo "❌ GitHub CLI not authenticated"
        echo "Please run: gh auth login"
        exit 1
    fi

# If GitHub CLI not available, try using GitHub API
else
    echo "⚠️  GitHub CLI not found. Installing via Homebrew..."
    
    if command -v brew &> /dev/null; then
        echo "📦 Installing GitHub CLI..."
        brew install gh
        
        echo "🔐 Please authenticate GitHub CLI:"
        gh auth login
        
        echo "📦 Creating repository: ${REPO_NAME}..."
        gh repo create ${REPO_NAME} --public --source=. --remote=origin --push
        
        echo ""
        echo "✅ Success! Repository created and code pushed!"
        echo "🌐 View your repository at: ${REPO_URL}"
        
    else
        echo "❌ Homebrew not found. Cannot install GitHub CLI automatically."
        echo ""
        echo "Please choose one of these options:"
        echo ""
        echo "Option 1: Install GitHub CLI manually"
        echo "  brew install gh"
        echo "  gh auth login"
        echo "  Then run this script again"
        echo ""
        echo "Option 2: Create repository manually"
        echo "  1. Go to: https://github.com/new"
        echo "  2. Repository name: ${REPO_NAME}"
        echo "  3. Make it Public"
        echo "  4. Don't initialize with README"
        echo "  5. Click 'Create repository'"
        echo "  6. Then run: git push -u origin main"
        echo ""
        echo "Option 3: Use GitHub API with token"
        echo "  Create a token at: https://github.com/settings/tokens"
        echo "  Then run:"
        echo "  curl -X POST -H 'Authorization: token YOUR_TOKEN' \\"
        echo "    https://api.github.com/user/repos \\"
        echo "    -d '{\"name\":\"${REPO_NAME}\",\"public\":true}'"
        echo "  git push -u origin main"
        exit 1
    fi
fi

echo ""
echo "🎉 Done! Your code is now on GitHub!"
echo "📖 Next steps:"
echo "   1. Visit: ${REPO_URL}"
echo "   2. Deploy to Vercel: https://vercel.com (import from GitHub)"
echo "   3. Or enable GitHub Pages in repository settings"

