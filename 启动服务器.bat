@echo off
echo 正在启动本地服务器...
echo 请在浏览器中访问: http://localhost:8000/worldcup2026_players.html
echo 按 Ctrl+C 可以停止服务器
echo.
py -m http.server 8000
pause
