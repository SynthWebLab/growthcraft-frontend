#!/usr/bin/env node

/**
 * Quick diagnostic script to check backend connection
 * Run: node check-backend.js
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001/api/v1";
const BACKEND_BASE = BACKEND_URL.replace("/api/v1", "");

console.log("🔍 Checking backend connection...\n");

async function checkHealth() {
  try {
    console.log(`📡 Testing: ${BACKEND_BASE}/health`);
    const response = await fetch(`${BACKEND_BASE}/health`);
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Backend is running!");
      console.log("   Response:", JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log(`❌ Backend returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log("❌ Cannot connect to backend");
    console.log("   Error:", error.message);
    return false;
  }
}

async function checkCORS() {
  try {
    console.log(`\n📡 Testing CORS: ${BACKEND_URL}/auth/register`);
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "OPTIONS",
      headers: {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
      },
    });

    const corsHeaders = {
      "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
      "Access-Control-Allow-Credentials": response.headers.get("Access-Control-Allow-Credentials"),
      "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
    };

    console.log("   CORS Headers:", JSON.stringify(corsHeaders, null, 2));

    if (corsHeaders["Access-Control-Allow-Origin"] === "http://localhost:3000" ||
        corsHeaders["Access-Control-Allow-Origin"] === "*") {
      console.log("✅ CORS is configured");
      
      if (corsHeaders["Access-Control-Allow-Credentials"] === "true") {
        console.log("✅ Credentials are allowed");
      } else {
        console.log("⚠️  Credentials not allowed (needed for cookies)");
      }
    } else {
      console.log("❌ CORS not configured for http://localhost:3000");
    }
  } catch (error) {
    console.log("❌ CORS check failed");
    console.log("   Error:", error.message);
  }
}

async function checkEnv() {
  console.log("\n📋 Environment Check:");
  console.log(`   NEXT_PUBLIC_BACKEND_URL: ${BACKEND_URL}`);
  console.log(`   Backend Base: ${BACKEND_BASE}`);
  
  // Check if .env.local exists
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '.env.local');
  
  if (fs.existsSync(envPath)) {
    console.log("✅ .env.local exists");
  } else {
    console.log("❌ .env.local not found");
    console.log("   Create it from .env.example");
  }
}

async function main() {
  checkEnv();
  
  const healthOk = await checkHealth();
  
  if (healthOk) {
    await checkCORS();
  } else {
    console.log("\n❌ Backend is not running or not accessible");
    console.log("\n💡 Solutions:");
    console.log("   1. Start backend: cd ../backend && npm run dev");
    console.log("   2. Check backend is on port 5001");
    console.log("   3. Check firewall settings");
  }

  console.log("\n" + "=".repeat(50));
  console.log("📚 For more help, see TROUBLESHOOTING.md");
  console.log("=".repeat(50) + "\n");
}

main().catch(console.error);
