#!/bin/bash
cd ~/Projects/JobSniper
git add .
git commit -m "fix: Next.js 15 params Promise type + remove PWA + fix schema unique"
git push origin master
echo "✅ pushed — Vercel 正在重新部署"
