# Katcheri Events Backend

Flask REST API for the Katcheri Events e-commerce platform.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables in `.env`:
```env
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
SQLSERVER_CONN=mssql+pyodbc://USER:PASS@SERVER:1433/DBNAME?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
CORS_ORIGINS=http://localhost:5173
```

3. Initialize database:
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

4. Run the server:
```bash
python run.py
```

## API Documentation

See main README.md for API endpoint documentation.

## Database Migrations

Create a new migration:
```bash
flask db migrate -m "Description of changes"
```

Apply migrations:
```bash
flask db upgrade
```

## Testing

Run tests (when implemented):
```bash
pytest
```

