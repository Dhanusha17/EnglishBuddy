import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api";

async function runTests() {
  console.log("--- Setup: Register & Login for Certificate Test ---");
  const testEmail = `cert_test_\${Date.now()}@englishbuddy.com`;
  
  // Register
  await fetch(`\${API_URL}/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Cert Test User", email: testEmail, password: "Password@123" })
  });

  // Admin Login to approve
  const adminRes = await fetch(`\${API_URL}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@englishbuddy.com", password: "Admin@123" })
  });
  const adminCookie = adminRes.headers.raw()['set-cookie'].map(c => c.split(';')[0]).join('; ');

  // Get user ID
  const pendingRes = await fetch(`\${API_URL}/admin/users/pending`, { headers: { "Cookie": adminCookie } });
  const pendingData = await pendingRes.json();
  const newUser = pendingData.data?.find((u) => u.email === testEmail);

  if (newUser) {
    await fetch(`\${API_URL}/admin/users/\${newUser.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json", "Cookie": adminCookie },
      body: JSON.stringify({ status: "ACTIVE" })
    });
  }

  // User Login
  const userRes = await fetch(`\${API_URL}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail, password: "Password@123" })
  });
  const userCookie = userRes.headers.raw()['set-cookie'].map(c => c.split(';')[0]).join('; ');
  
  console.log("Logged in. Testing Certificate Evaluation...");

  // Try to generate a certificate they aren't eligible for
  const failRes = await fetch(`\${API_URL}/certificates/evaluate`, {
    method: "POST", headers: { "Content-Type": "application/json", "Cookie": userCookie },
    body: JSON.stringify({ category: "GAMIFICATION_MASTER" })
  });
  const failData = await failRes.json();
  if (failRes.status === 400 && failData.error.includes("not met")) {
    console.log("✅ Correctly rejected ineligible certificate request.");
  } else {
    console.error("❌ Failed to reject ineligible certificate request.", failData);
  }

  // Admin directly insert a certificate into DB using prisma logic in a script? 
  // No, we can just test the evaluate endpoint logic. 
  // Wait, let's just make the user eligible for Gamification Master by updating the DB.
  console.log("Updating user to 1000 XP in DB for testing...");
}

runTests();
