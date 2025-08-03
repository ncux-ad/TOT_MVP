# Скрипт тестирования API эндпоинтов
# Запускать после запуска всех сервисов

Write-Host "🧪 Тестирование API эндпоинтов ТОТ..." -ForegroundColor Green

# Проверяем, что мы в корневой папке проекта
if (-not (Test-Path "backend")) {
    Write-Host "❌ Ошибка: Запустите скрипт из корневой папки проекта!" -ForegroundColor Red
    exit 1
}

# Функция для тестирования эндпоинта
function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [string]$Description,
        [hashtable]$Headers = @{}
    )
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers -ErrorAction Stop
        Write-Host "✅ $Description" -ForegroundColor Green
        return $true
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "❌ $Description (HTTP $statusCode)" -ForegroundColor Red
        return $false
    }
}

# Функция для тестирования эндпоинта с ожидаемым статусом
function Test-EndpointWithStatus {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [string]$Description,
        [int]$ExpectedStatus = 200,
        [hashtable]$Headers = @{}
    )
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers -ErrorAction Stop
        Write-Host "✅ $Description" -ForegroundColor Green
        return $true
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "✅ $Description (ожидаемый статус $ExpectedStatus)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $Description (HTTP $statusCode, ожидался $ExpectedStatus)" -ForegroundColor Red
            return $false
        }
    }
}

Write-Host "`n🔍 Проверка доступности сервисов..." -ForegroundColor Cyan

# Проверяем health check эндпоинты
$healthTests = @(
    @{Url="http://localhost:8000/health"; Description="API Gateway Health Check"},
    @{Url="http://localhost:8001/health"; Description="User Service Health Check"},
    @{Url="http://localhost:8002/health"; Description="Profile Service Health Check"},
    @{Url="http://localhost:8003/health"; Description="Booking Service Health Check"}
)

$healthResults = @()
foreach ($test in $healthTests) {
    $result = Test-Endpoint -Url $test.Url -Description $test.Description
    $healthResults += $result
}

Write-Host "`n📊 Тестирование эндпоинтов статистики..." -ForegroundColor Cyan

# Тестируем эндпоинты статистики
$statsTests = @(
    @{Url="http://localhost:8001/users/count"; Description="User Service - количество пользователей"},
    @{Url="http://localhost:8002/doctor-profiles/count"; Description="Profile Service - количество врачей"},
    @{Url="http://localhost:8002/clinic-profiles/count"; Description="Profile Service - количество клиник"},
    @{Url="http://localhost:8003/bookings/count"; Description="Booking Service - количество заказов"}
)

$statsResults = @()
foreach ($test in $statsTests) {
    $result = Test-Endpoint -Url $test.Url -Description $test.Description
    $statsResults += $result
}

Write-Host "`n🔐 Тестирование эндпоинтов аутентификации..." -ForegroundColor Cyan

# Тестируем эндпоинты аутентификации (ожидаем 401 без токена)
$authTests = @(
    @{Url="http://localhost:8000/auth/me"; Description="API Gateway - /auth/me (без токена)"; ExpectedStatus=401},
    @{Url="http://localhost:8000/admin/users"; Description="API Gateway - /admin/users (без токена)"; ExpectedStatus=401},
    @{Url="http://localhost:8000/api/dashboard/stats"; Description="API Gateway - /api/dashboard/stats (без токена)"; ExpectedStatus=401}
)

$authResults = @()
foreach ($test in $authTests) {
    $result = Test-EndpointWithStatus -Url $test.Url -Description $test.Description -ExpectedStatus $test.ExpectedStatus
    $authResults += $result
}

Write-Host "`n👥 Тестирование эндпоинтов пользователей..." -ForegroundColor Cyan

# Тестируем эндпоинты пользователей
$userTests = @(
    @{Url="http://localhost:8001/users"; Description="User Service - список пользователей"},
    @{Url="http://localhost:8001/users?page=1&limit=10"; Description="User Service - список пользователей с пагинацией"}
)

$userResults = @()
foreach ($test in $userTests) {
    $result = Test-Endpoint -Url $test.Url -Description $test.Description
    $userResults += $result
}

Write-Host "`n👨‍⚕️ Тестирование эндпоинтов врачей..." -ForegroundColor Cyan

# Тестируем эндпоинты врачей
$doctorTests = @(
    @{Url="http://localhost:8002/doctor-profiles/"; Description="Profile Service - список врачей"}
)

$doctorResults = @()
foreach ($test in $doctorTests) {
    $result = Test-Endpoint -Url $test.Url -Description $test.Description
    $doctorResults += $result
}

Write-Host "`n🏥 Тестирование эндпоинтов клиник..." -ForegroundColor Cyan

# Тестируем эндпоинты клиник
$clinicTests = @(
    @{Url="http://localhost:8002/clinic-profiles/"; Description="Profile Service - список клиник"}
)

$clinicResults = @()
foreach ($test in $clinicTests) {
    $result = Test-Endpoint -Url $test.Url -Description $test.Description
    $clinicResults += $result
}

# Подсчитываем результаты
$allResults = $healthResults + $statsResults + $authResults + $userResults + $doctorResults + $clinicResults
$passed = ($allResults | Where-Object { $_ -eq $true }).Count
$total = $allResults.Count

Write-Host "`n📈 Результаты тестирования:" -ForegroundColor Cyan
Write-Host "✅ Успешно: $passed из $total" -ForegroundColor Green
Write-Host "❌ Ошибок: $($total - $passed) из $total" -ForegroundColor Red

if ($passed -eq $total) {
    Write-Host "`n🎉 Все эндпоинты работают корректно!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Обнаружены проблемы с некоторыми эндпоинтами" -ForegroundColor Yellow
}

Write-Host "`n📚 Swagger документация:" -ForegroundColor Cyan
Write-Host "• API Gateway: http://localhost:8000/docs" -ForegroundColor White
Write-Host "• User Service: http://localhost:8001/docs" -ForegroundColor White
Write-Host "• Profile Service: http://localhost:8002/docs" -ForegroundColor White

Write-Host "`n💡 Рекомендации:" -ForegroundColor Cyan
Write-Host "• Проверьте логи сервисов при ошибках" -ForegroundColor White
Write-Host "• Используйте Swagger UI для детального тестирования" -ForegroundColor White
Write-Host "• Обновите документацию при добавлении новых эндпоинтов" -ForegroundColor White

exit 0 