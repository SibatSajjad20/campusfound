@echo off
echo ========================================
echo   CampusFound - Starting Application
echo ========================================
echo.

echo Starting Backend Server...
start cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo   Backend: http://localhost:3000
echo   Frontend: http://localhost:5173
echo ========================================
echo.
pause
