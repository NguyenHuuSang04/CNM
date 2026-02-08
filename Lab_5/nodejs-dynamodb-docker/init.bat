@echo off
echo ================================================
echo Testing DynamoDB Connection and Initialization
echo ================================================
echo.

echo Step 1: Testing connection to DynamoDB...
docker-compose exec app npm run test-connection
echo.

echo Step 2: Initializing Products table...
docker-compose exec app npm run init-db
echo.

echo ================================================
echo Done! Now you can test the API:
echo.
echo curl http://localhost:3000/api/products
echo ================================================
pause
