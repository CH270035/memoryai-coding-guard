# install.ps1 — install MemoryAI Coding-Guard on Windows via npx
# Usage: iwr https://coding-guard.memoryai.dev/install.ps1 | iex

$ErrorActionPreference = "Stop"
$Pkg = "@memoryai.dev/coding-guard"

Write-Host ""
Write-Host "  MemoryAI Coding-Guard installer" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "  ERROR: Node.js >= 18 required." -ForegroundColor Red
    Write-Host "  Install from https://nodejs.org/"
    exit 1
}

$nodeVersion = (node -v).TrimStart('v')
$nodeMajor = [int]($nodeVersion.Split('.')[0])
if ($nodeMajor -lt 18) {
    Write-Host "  ERROR: Node.js 18+ required (found v$nodeVersion)." -ForegroundColor Red
    exit 1
}

Write-Host "  Detected Node v$nodeVersion"
Write-Host "  Running: npx -y $Pkg install"
Write-Host ""

$args = $args -join ' '
& npx -y $Pkg install $args
