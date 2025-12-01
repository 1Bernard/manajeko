#!/bin/bash

# Quantask API - Quick Test Script
# Tests the Identity feature endpoints

BASE_URL="http://localhost:3001/api/v1"
EMAIL="test@quantask.com"
PASSWORD="password123"

echo "============================================"
echo "Quantask API - Identity Feature Test"
echo "============================================"
echo ""
echo "Make sure the Rails server is running on port 3001:"
echo "  cd quantask-api && bin/rails server -p 3001"
echo ""
echo "Press Enter to continue..."
read

echo ""
echo "1. Testing Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"password_confirmation\": \"$PASSWORD\",
    \"first_name\": \"Test\",
    \"last_name\": \"User\",
    \"otp_method\": \"email\"
  }")

echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"

# Extract token
TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('token', ''))" 2>/dev/null)

if [ -n "$TOKEN" ]; then
  echo "✅ Registration successful!"
  echo ""
  
  echo "2. Testing /me endpoint..."
  ME_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/me" \
    -H "Authorization: Bearer $TOKEN")
  
  echo "$ME_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ME_RESPONSE"
  echo ""
fi

echo "3. Testing Login (OTP will be sent)..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

echo "============================================"
echo "Check the Rails server console for the OTP code!"
echo "Then test OTP verification with:"
echo ""
echo "curl -X POST $BASE_URL/auth/verify-otp \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\": \"$EMAIL\", \"otp_code\": \"YOUR_OTP\"}'"
echo "============================================"
