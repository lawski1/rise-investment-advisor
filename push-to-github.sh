#!/bin/bash
# Script to push to GitHub
# Replace YOUR_USERNAME with your GitHub username

echo "🚀 Pushing Rise Investment Advisor to GitHub..."
echo ""
echo "Please provide your GitHub repository URL"
echo "Example: https://github.com/YOUR_USERNAME/rise-investment-advisor.git"
echo ""
read -p "Enter your GitHub repository URL: " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

echo ""
echo "📦 Adding remote repository..."
git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"

echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Your repository is now available at: $repo_url"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "   1. Repository URL is correct"
    echo "   2. You have access to the repository"
    echo "   3. You're authenticated with GitHub (git credential helper)"
fi



