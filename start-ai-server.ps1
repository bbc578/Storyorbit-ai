$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$server = Join-Path $root "server\server.py"

if (-not $env:STORYORBIT_API_KEY -and -not $env:DASHSCOPE_API_KEY) {
  $secure = Read-Host "Enter compatible cloud AI API key (not saved to file)" -AsSecureString
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try {
    $env:STORYORBIT_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
  }
}

if (-not $env:STORYORBIT_MODEL -and -not $env:DASHSCOPE_MODEL) {
  $env:STORYORBIT_MODEL = "qwen-plus"
}

Write-Host "Starting StoryOrbit AI local proxy: http://127.0.0.1:8787"
$displayModel = if ($env:STORYORBIT_MODEL) { $env:STORYORBIT_MODEL } else { $env:DASHSCOPE_MODEL }
Write-Host "Model: $displayModel"
Write-Host "Keep this window open, then open app\index.html"
python $server
