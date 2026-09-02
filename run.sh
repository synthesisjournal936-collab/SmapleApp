#!/bin/sh
echo "============================================================"
echo "  NexusOps - Open Source AI Automation Test Application"
echo "  Starting local development server..."
echo "============================================================"
echo ""

if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js is not installed or not in PATH."
    echo "Please install Node.js from https://nodejs.org/ to run locally."
    exit 1
fi

npx -y vite --open
