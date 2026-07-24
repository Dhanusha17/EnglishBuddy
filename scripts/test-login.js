import fetch from "node-fetch";

async function testLogin() {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "  Admin@EnglishBuddy.com  ", password: "Admin@123" })
  });

  console.log("Status:", res.status);
  console.log("Response:", await res.json());
}

testLogin();
