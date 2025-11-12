@echo off
REM Batch script to set up virtual environment for Katcheri Events Backend

echo Setting up virtual environment for Katcheri Events Backend...

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    python3 --version >nul 2>&1
    if %errorlevel% neq 0 (
        py --version >nul 2>&1
        if %errorlevel% neq 0 (
            echo ERROR: Python not found!
            echo Please install Python 3.11+ from https://www.python.org/downloads/
            echo Make sure to check 'Add Python to PATH' during installation.
            pause
            exit /b 1
        ) else (
            set PYTHON_CMD=py
        )
    ) else (
        set PYTHON_CMD=python3
    )
) else (
    set PYTHON_CMD=python
)

echo Found Python: %PYTHON_CMD%

REM Create virtual environment
echo Creating virtual environment...
%PYTHON_CMD% -m venv venv

if %errorlevel% equ 0 (
    echo Virtual environment created successfully!
    
    REM Activate virtual environment
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
    
    echo Installing dependencies...
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    
    echo.
    echo Setup complete!
    echo To activate the virtual environment in the future, run:
    echo   venv\Scripts\activate.bat
    echo.
    echo To deactivate, run:
    echo   deactivate
) else (
    echo Failed to create virtual environment!
    pause
    exit /b 1
)

pause




