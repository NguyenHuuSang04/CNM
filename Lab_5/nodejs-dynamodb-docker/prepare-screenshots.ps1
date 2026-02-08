# Script tự động chuẩn bị dữ liệu mẫu để chụp ảnh

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   CHUẨN BỊ DỰ ÁN ĐỂ CHỤP ẢNH NỘP BÀI" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Kiểm tra containers
Write-Host "[1/7] Kiểm tra containers..." -ForegroundColor Yellow
docker-compose ps
Write-Host ""

# 2. Restart containers
Write-Host "[2/7] Restart containers để có logs sạch..." -ForegroundColor Yellow
docker-compose restart
Start-Sleep -Seconds 5
Write-Host "✅ Đã restart!" -ForegroundColor Green
Write-Host ""

# 3. Kiểm tra DynamoDB
Write-Host "[3/7] Kiểm tra DynamoDB logs..." -ForegroundColor Yellow
docker-compose logs dynamodb-local --tail=15
Write-Host ""

# 4. Kiểm tra App
Write-Host "[4/7] Kiểm tra App logs..." -ForegroundColor Yellow
docker-compose logs app --tail=15
Write-Host ""

# 5. Test API
Write-Host "[5/7] Test API GET..." -ForegroundColor Yellow
try {
    $result = Invoke-RestMethod -Uri http://localhost:3000/api/products
    Write-Host "✅ API hoạt động! Số sản phẩm hiện tại: $($result.count)" -ForegroundColor Green
} catch {
    Write-Host "❌ API chưa hoạt động. Đợi thêm 3 giây..." -ForegroundColor Red
    Start-Sleep -Seconds 3
}
Write-Host ""

# 6. Thêm dữ liệu mẫu
Write-Host "[6/7] Thêm dữ liệu mẫu..." -ForegroundColor Yellow

$products = @(
    @{
        name = 'iPhone 15 Pro Max'
        price = 999
        url_image = 'https://images.unsplash.com/photo-1592286943541-1f8e1d4c8837?w=400'
    },
    @{
        name = 'MacBook Pro 16 inch M3 Max'
        price = 2399
        url_image = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
    },
    @{
        name = 'AirPods Pro 2nd Gen'
        price = 249
        url_image = 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400'
    },
    @{
        name = 'Apple Watch Ultra 2'
        price = 799
        url_image = 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400'
    },
    @{
        name = 'iPad Pro 12.9 inch'
        price = 1099
        url_image = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'
    }
)

$added = 0
$skipped = 0

foreach ($product in $products) {
    $body = $product | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri http://localhost:3000/api/products `
            -Method Post `
            -Body $body `
            -ContentType 'application/json' `
            -ErrorAction Stop
        
        Write-Host "  ✅ Đã thêm: $($product.name)" -ForegroundColor Green
        $added++
    } catch {
        Write-Host "  ⚠️  Có thể đã tồn tại: $($product.name)" -ForegroundColor Yellow
        $skipped++
    }
    Start-Sleep -Milliseconds 200
}

Write-Host ""
Write-Host "Kết quả: Đã thêm $added, Bỏ qua $skipped" -ForegroundColor Cyan
Write-Host ""

# 7. Mở browser
Write-Host "[7/7] Mở giao diện web..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"
Start-Sleep -Seconds 2
Write-Host "✅ Đã mở browser!" -ForegroundColor Green
Write-Host ""

# Hiển thị danh sách sản phẩm
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   DANH SÁCH SẢN PHẨM HIỆN TẠI" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
$allProducts = Invoke-RestMethod -Uri http://localhost:3000/api/products
$allProducts.data | Format-Table -Property name, price -AutoSize
Write-Host ""

# Hướng dẫn tiếp theo
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   HOÀN TẤT! BÂY GIỜ BẠN CÓ THỂ:" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📸 CHỤP CÁC ẢNH SAU:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Docker Containers:" -ForegroundColor White
Write-Host "   docker-compose ps" -ForegroundColor Gray
Write-Host ""
Write-Host "2. DynamoDB Logs:" -ForegroundColor White
Write-Host "   docker-compose logs dynamodb-local" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Bảng Products:" -ForegroundColor White
Write-Host "   docker-compose exec app npm run init-db" -ForegroundColor Gray
Write-Host ""
Write-Host "4. File docker-compose.yml trong VS Code" -ForegroundColor White
Write-Host ""
Write-Host "5. File .env trong VS Code" -ForegroundColor White
Write-Host ""
Write-Host "6. Giao diện web: http://localhost:3000" -ForegroundColor White
Write-Host "   (Browser đã được mở sẵn)" -ForegroundColor Gray
Write-Host ""
Write-Host "7. Test API GET:" -ForegroundColor White
Write-Host "   Invoke-RestMethod -Uri http://localhost:3000/api/products | ConvertTo-Json" -ForegroundColor Gray
Write-Host ""
Write-Host "8. Cấu trúc MVC trong VS Code:" -ForegroundColor White
Write-Host "   - models/Product.js" -ForegroundColor Gray
Write-Host "   - controllers/productController.js" -ForegroundColor Gray
Write-Host "   - routes/productRoutes.js" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "📖 XEM HƯỚNG DẪN CHI TIẾT:" -ForegroundColor Yellow
Write-Host "   SCREENSHOT_GUIDE.md" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Tạo file tóm tắt lệnh
$commands = @"
# ===============================================
# CÁC LỆNH CHỤP ẢNH
# ===============================================

# 1. Docker containers
docker-compose ps

# 2. DynamoDB logs
docker-compose logs dynamodb-local --tail=20

# 3. App logs
docker-compose logs app --tail=20

# 4. Kiểm tra bảng Products
docker-compose exec app npm run init-db

# 5. Test API GET
Invoke-RestMethod -Uri http://localhost:3000/api/products | ConvertTo-Json

# 6. Test API POST
`$body = @{name='Test Product';price=100;url_image='https://example.com/test.jpg'} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/api/products -Method Post -Body `$body -ContentType 'application/json' | ConvertTo-Json

# 7. Xem cấu trúc project
Get-ChildItem -Path . -Recurse -Depth 2 | Where-Object {`$_.Name -notmatch 'node_modules|.git'} | Select-Object FullName

# 8. Restart nếu cần
docker-compose restart

# ===============================================
"@

$commands | Out-File -FilePath "screenshot-commands.txt" -Encoding UTF8
Write-Host "💾 Đã lưu danh sách lệnh vào: screenshot-commands.txt" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Sẵn sàng chụp ảnh! Chúc bạn làm bài tốt!" -ForegroundColor Green
