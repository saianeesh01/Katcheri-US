# Katcheri Events Platform

This repository contains the full-stack implementation of the Katcheri events website. It includes a Flask REST API backend and a React + Vite frontend that work together to power event discovery, ticket sales, club information, and news updates.

## Project Structure

```
Katcheri-US/
├── backend/   # Flask API (Python)
└── frontend/  # React + Vite SPA (TypeScript)
```

## Quick Start

Follow these steps to run both services locally:

1. **Clone**
   ```bash
   git clone https://github.com/saianeesh01/Katcheri-US.git
   cd Katcheri-US
   ```

2. **Backend**
   ```bash
   cd backend
   python -m venv venv
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   # macOS/Linux
   source venv/bin/activate

   pip install -r requirements.txt
   ```

   Create a `.env` file in `backend/` with values like:
   ```
   SECRET_KEY=your-secret-key
   JWT_SECRET=your-jwt-secret
   SQLSERVER_CONN=mssql+pyodbc://USER:PASS@SERVER:1433/DBNAME?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
   CORS_ORIGINS=http://localhost:5173
   ```

   If this is your first run, initialize the database:
   ```bash
   flask db upgrade
   ```

   Finally, start the backend:
   ```bash
   python run.py
   ```

   The API will be available at `http://localhost:5000`.

3. **Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

   Create `frontend/.env` with:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

   Run the dev server:
   ```bash
   npm run dev
   ```

   Open the site at `http://localhost:5173`.

## Detailed Backend Setup

> All commands assume you are inside `Katcheri-US/backend`.

- **Virtual Environment**
  ```bash
  python -m venv venv
  ```
- **Activate**
  ```bash
  # Windows PowerShell
  .\venv\Scripts\Activate.ps1
  # Bash (macOS/Linux)
  source venv/bin/activate
  ```
- **Install dependencies**
  ```bash
  pip install -r requirements.txt
  ```
- **Environment configuration**  
  Provide the secrets and database connection string via `.env` as shown above.
- **Database migrations**
  ```bash
  flask db init      # first time only
  flask db migrate   # whenever models change
  flask db upgrade
  ```
- **Run the API**
  ```bash
  python run.py
  ```

## Detailed Frontend Setup

> All commands assume you are inside `Katcheri-US/frontend`.

- **Install dependencies**
  ```bash
  npm install
  ```
- **Environment variables**
  ```
  VITE_API_BASE_URL=http://localhost:5000/api/v1
  ```
- **Development server**
  ```bash
  npm run dev
  ```
- **Production build**
  ```bash
  npm run build
  ```

## Useful Commands

| Task                  | Backend                            | Frontend             |
| --------------------- | ----------------------------------- | -------------------- |
| Start dev server      | `python run.py`                     | `npm run dev`        |
| Run tests             | `pytest` (when tests are added)     | `npm test`           |
| Lint / format         | `flake8` / `black` (if configured)  | `npm run lint`       |
| Build for production  | (Deploy via WSGI/Gunicorn)          | `npm run build`      |

## Troubleshooting

- Ensure Microsoft SQL Server or Azure SQL is reachable and that you have installed the `ODBC Driver 18 for SQL Server`.
- When using PowerShell, allow script execution for virtualenvs:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```
- If Tailwind complains about missing colors, verify the custom names defined in `frontend/tailwind.config.js`.

## Contributing

1. Create a feature branch: `git checkout -b feature/my-change`
2. Make your updates in `backend/` or `frontend/`
3. Run tests / builds where applicable
4. Commit with a descriptive message
5. Submit a pull request

## License

This project is proprietary and intended for internal use. Contact the maintainers for usage questions.

