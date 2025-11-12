# PowerShell script to set up virtual environment for Katcheri Events Backend

Write-Host "Setting up virtual environment for Katcheri Events Backend..." -ForegroundColor Green

# Check if Python is available
$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    $pythonCmd = "python3"
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $pythonCmd = "py"
} else {
    Write-Host "ERROR: Python not found!" -ForegroundColor Red
    Write-Host "Please install Python 3.11+ from https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Make sure to check 'Add Python to PATH' during installation." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found Python: $pythonCmd" -ForegroundColor Green

# Create virtual environment
Write-Host "Creating virtual environment..." -ForegroundColor Cyan
& $pythonCmd -m venv venv

if ($LASTEXITCODE -eq 0) {
    Write-Host "Virtual environment created successfully!" -ForegroundColor Green
    
    # Activate virtual environment
    Write-Host "Activating virtual environment..." -ForegroundColor Cyan
    & .\venv\Scripts\Activate.ps1
    
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    pip install --upgrade pip
    pip install -r requirements.txt
    
    Write-Host "`nSetup complete!" -ForegroundColor Green
    Write-Host "To activate the virtual environment in the future, run:" -ForegroundColor Yellow
    Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
    Write-Host "`nTo deactivate, run:" -ForegroundColor Yellow
    Write-Host "  deactivate" -ForegroundColor Cyan
} else {
    Write-Host "Failed to create virtual environment!" -ForegroundColor Red
    exit 1
}




