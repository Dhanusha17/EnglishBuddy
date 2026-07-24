import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api/auth";

async function runTests() {
  console.log("--- 1. Testing Registration ---");
  const testEmail = `testuser_${Date.now()}@englishbuddy.com`;
  const registerRes = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      email: testEmail,
      password: "Password@123"
    })
  });
  console.log("Register Status:", registerRes.status);
  const registerData = await registerRes.json();
  console.log("Register Response:", registerData);

  console.log("\n--- 2. Testing Login for Pending User ---");
  const loginRes = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: "Password@123"
    })
  });
  console.log("Pending Login Status:", loginRes.status);
  console.log("Pending Login Response:", await loginRes.json());
}

runTests();
