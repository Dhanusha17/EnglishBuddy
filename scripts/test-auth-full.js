import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api";

async function runTests() {
  const testEmail = `testuser_${Date.now()}@englishbuddy.com`;
  
  // 1. Register
  console.log("--- Register ---");
  await fetch(`${API_URL}/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test User", email: testEmail, password: "Password@123" })
  });

  // 2. Admin Login
  console.log("\n--- Admin Login ---");
  const adminRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@englishbuddy.com", password: "Admin@123" })
  });
  
  const adminCookies = adminRes.headers.raw()['set-cookie'];
  const cookieHeader = adminCookies.map(c => c.split(';')[0]).join('; ');
  console.log("Admin Login Status:", adminRes.status);
  
  // 3. Find User ID
  const pendingRes = await fetch(`${API_URL}/admin/users/pending`, {
    headers: { "Cookie": cookieHeader }
  });
  const pendingData = await pendingRes.json();
  console.log("Pending Data:", pendingData);
  const newUser = pendingData.data?.find((u) => u.email === testEmail);
  console.log("Found New User:", newUser ? newUser.id : "Not found");

  if (!newUser) return;

  // 4. Approve User
  console.log("\n--- Approve User ---");
  const approveRes = await fetch(`${API_URL}/admin/users/${newUser.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "Cookie": cookieHeader },
    body: JSON.stringify({ status: "ACTIVE" })
  });
  console.log("Approve Status:", approveRes.status);

  // 5. User Login
  console.log("\n--- User Login ---");
  const userRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail, password: "Password@123" })
  });
  const userCookies = userRes.headers.raw()['set-cookie'];
  const userCookieHeader = userCookies ? userCookies.map(c => c.split(';')[0]).join('; ') : "";
  console.log("User Login Status:", userRes.status);

  // 6. Test User Access to Student Route
  console.log("\n--- User -> Student Route ---");
  const studentRouteRes = await fetch(`http://localhost:3000/api/learning/quizzes`, {
    headers: { "Cookie": userCookieHeader }
  });
  console.log("Student Route Status:", studentRouteRes.status);

  // 7. Test User Access to Admin Route
  console.log("\n--- User -> Admin Route ---");
  const adminRouteRes = await fetch(`http://localhost:3000/api/admin/quizzes`, {
    headers: { "Cookie": userCookieHeader }
  });
  console.log("Admin Route Status:", adminRouteRes.status);
}

runTests();
