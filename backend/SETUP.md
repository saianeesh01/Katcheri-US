# Backend Setup Guide

## Prerequisites

1. **Python 3.11 or higher** must be installed
   - Download from: https://www.python.org/downloads/
   - **Important**: During installation, check "Add Python to PATH"

2. Verify Python installation:
   ```powershell
   python --version
   ```
   or
   ```powershell
   py --version
   ```

## Quick Setup (Automated)

### Option 1: PowerShell Script
```powershell
cd Katcheri-US\backend
.\setup_venv.ps1
```

If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup_venv.ps1
```

### Option 2: Batch Script
```cmd
cd Katcheri-US\backend
setup_venv.bat
```

## Manual Setup

If the automated scripts don't work, follow these steps:

### Step 1: Navigate to Backend Directory
```powershell
cd Katcheri-US\backend
```

### Step 2: Create Virtual Environment
```powershell
python -m venv venv
```
or if that doesn't work:
```powershell
py -m venv venv
```

### Step 3: Activate Virtual Environment

**PowerShell:**
```powershell
.\venv\Scripts\Activate.ps1
```

If you get an execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
```

**Command Prompt (CMD):**
```cmd
venv\Scripts\activate.bat
```

**Git Bash:**
```bash
source venv/Scripts/activate
```

You should see `(venv)` at the beginning of your command prompt when activated.

### Step 4: Upgrade pip
```powershell
python -m pip install --upgrade pip
```

### Step 5: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step 6: Create .env File
Create a `.env` file in the `backend` directory with the following content:

```env
SECRET_KEY=your-secret-key-change-this-in-production
JWT_SECRET=your-jwt-secret-change-this-in-production
# Optional: Use SQL Server by uncommenting and filling in your details
# SQLSERVER_CONN=mssql+pyodbc://USER:PASS@SERVER:1433/DBNAME?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Note:** The backend now defaults to using a local SQLite database located at `backend/instance/katcheri_dev.db` if no `SQLSERVER_CONN` or `DATABASE_URL` is provided. Only add the SQL Server connection string if you are ready to connect to SQL Server.

### Step 7: Initialize Database (Optional)
If you have Flask-Migrate set up:
```powershell
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### Step 8: Run the Server
```powershell
python run.py
```

The server will start on `http://localhost:5000`

## Troubleshooting

### Python Not Found
- Make sure Python is installed and added to PATH
- Try using `py` instead of `python`
- Restart your terminal after installing Python

### Execution Policy Error (PowerShell)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Virtual Environment Already Exists
If you need to recreate it:
```powershell
Remove-Item -Recurse -Force venv
python -m venv venv
```

### Port Already in Use
If port 5000 is already in use, you can change it in `run.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Change port number
```

## Deactivating Virtual Environment

When you're done working:
```powershell
deactivate
```

## Next Steps

1. Set up your SQL Server database
2. Configure the `.env` file with your database connection
3. Run database migrations
4. Start the backend server
5. Set up and run the frontend (see `../frontend/README.md`)



