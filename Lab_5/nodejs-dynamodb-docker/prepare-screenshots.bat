@echo off
echo ================================================
echo CHUAN BI DU AN DE CHUP ANH NOP BAI
echo ================================================
echo.

echo [1/6] Kiem tra containers...
docker-compose ps
echo.

echo [2/6] Restart containers de co logs sach...
docker-compose restart
timeout /t 5 /nobreak > nul
echo.

echo [3/6] Kiem tra DynamoDB logs...
docker-compose logs dynamodb-local --tail=15
echo.

echo [4/6] Kiem tra App logs...
docker-compose logs app --tail=15
echo.

echo [5/6] Mo giao dien web...
start http://localhost:3000
timeout /t 2 /nobreak > nul
echo.

echo [6/6] Them du lieu mau...
echo.

powershell -Command "$products = @(@{name='iPhone 15 Pro Max';price=999;url_image='https://images.unsplash.com/photo-1592286943541-1f8e1d4c8837'},@{name='MacBook Pro 16 inch';price=2399;url_image='https://images.unsplash.com/photo-1517336714731-489689fd1ca8'},@{name='AirPods Pro';price=249;url_image='https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7'},@{name='Apple Watch Ultra';price=799;url_image='https://images.unsplash.com/photo-1579586337278-3befd40fd17a'}); foreach ($p in $products) { $body = $p | ConvertTo-Json; try { Invoke-RestMethod -Uri http://localhost:3000/api/products -Method Post -Body $body -ContentType 'application/json' -ErrorAction Stop | Out-Null; Write-Host \"Added: $($p.name)\" -ForegroundColor Green; } catch { Write-Host \"Product may already exist: $($p.name)\" -ForegroundColor Yellow; } }"

echo.
echo ================================================
echo HOAN TAT! BAY GIO BAN CO THE:
echo ================================================
echo 1. Chup anh Docker containers: docker-compose ps
echo 2. Chup anh logs: docker-compose logs
echo 3. Chup anh giao dien: http://localhost:3000
echo 4. Chup anh code trong VS Code
echo 5. Xem huong dan chi tiet: SCREENSHOT_GUIDE.md
echo ================================================
pause
