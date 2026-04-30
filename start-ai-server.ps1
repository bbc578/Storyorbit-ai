$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$server = Join-Path $root "server\server.py"

if (-not $env:DASHSCOPE_API_KEY) {
  $secure = Read-Host "Enter compatible cloud AI API key (not saved to file)" -AsSecureString
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try {
    $env:DASHSCOPE_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
  }
}

if (-not $env:DASHSCOPE_MODEL) {
  $env:DASHSCOPE_MODEL = "qwen-plus"
}

Write-Host "Starting StoryOrbit AI local proxy: http://127.0.0.1:8787"
Write-Host "Model: $env:DASHSCOPE_MODEL"
Write-Host "Keep this window open, then open app\index.html"
python $server
