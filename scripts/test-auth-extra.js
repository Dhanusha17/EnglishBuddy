import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api";

async function runTests() {
  const testEmail = `testuser_${Date.now()}@englishbuddy.com`;
  
  // 1. Register
  await fetch(`${API_URL}/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test User", email: testEmail, password: "Password@123" })
  });

  // 2. Admin Login
  const adminRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@englishbuddy.com", password: "Admin@123" })
  });
  const cookieHeader = adminRes.headers.raw()['set-cookie'].map(c => c.split(';')[0]).join('; ');

  // 3. Find User ID
  const pendingRes = await fetch(`${API_URL}/admin/users/pending`, { headers: { "Cookie": cookieHeader } });
  const pendingData = await pendingRes.json();
  const newUser = pendingData.data?.find((u) => u.email === testEmail);

  if (!newUser) return;

  console.log("--- Testing REJECTED Status ---");
  await fetch(`${API_URL}/admin/users/${newUser.id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json", "Cookie": cookieHeader },
    body: JSON.stringify({ status: "REJECTED" })
  });

  const rejectedLoginRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail, password: "Password@123" })
  });
  console.log("Rejected Login Status:", rejectedLoginRes.status);
  console.log("Rejected Login Response:", await rejectedLoginRes.json());

  console.log("\n--- Testing SUSPENDED Status ---");
  await fetch(`${API_URL}/admin/users/${newUser.id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json", "Cookie": cookieHeader },
    body: JSON.stringify({ status: "SUSPENDED" })
  });

  const suspendedLoginRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail, password: "Password@123" })
  });
  console.log("Suspended Login Status:", suspendedLoginRes.status);
  console.log("Suspended Login Response:", await suspendedLoginRes.json());
  
  console.log("\n--- Testing Logout ---");
  const logoutRes = await fetch(`${API_URL}/auth/logout`, {
    method: "POST", headers: { "Cookie": cookieHeader }
  });
  console.log("Logout Status:", logoutRes.status);
  
  // Try to access admin route after logout
  const adminRouteAfterLogoutRes = await fetch(`${API_URL}/admin/quizzes`, {
    headers: { "Cookie": logoutRes.headers.raw()['set-cookie']?.map(c => c.split(';')[0]).join('; ') || "" }
  });
  console.log("Admin Route After Logout Status:", adminRouteAfterLogoutRes.status);
}

runTests();
