import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api";

async function runTests() {
  console.log("--- Setup: Register & Login for Analytics Test ---");
  const testEmail = `analytics_test_${Date.now()}@englishbuddy.com`;
  
  // Register
  await fetch(`${API_URL}/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Analytics Test User", email: testEmail, password: "Password@123" })
  });

  // Admin Login to approve
  const adminRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@englishbuddy.com", password: "Admin@123" })
  });
  const adminCookie = adminRes.headers.raw()['set-cookie'].map(c => c.split(';')[0]).join('; ');

  // Get user ID
  const pendingRes = await fetch(`${API_URL}/admin/users/pending`, { headers: { "Cookie": adminCookie } });
  const pendingData = await pendingRes.json();
  const newUser = pendingData.data?.find((u) => u.email === testEmail);

  if (newUser) {
    await fetch(`${API_URL}/admin/users/${newUser.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json", "Cookie": adminCookie },
      body: JSON.stringify({ status: "ACTIVE" })
    });
  }

  // User Login
  const userRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail, password: "Password@123" })
  });
  const userCookie = userRes.headers.raw()['set-cookie'].map(c => c.split(';')[0]).join('; ');
  
  console.log("Logged in. Triggering AI actions to gain XP...\n");

  // 1. Trigger AI actions
  console.log("-> Grammar (should award 10 XP & start streak)");
  await fetch(`${API_URL}/ai/grammar`, {
    method: "POST", headers: { "Content-Type": "application/json", "Cookie": userCookie },
    body: JSON.stringify({ text: "I is going to the store yesterday." })
  });

  console.log("-> Vocabulary (should award 10 XP)");
  await fetch(`${API_URL}/ai/vocabulary`, {
    method: "POST", headers: { "Content-Type": "application/json", "Cookie": userCookie },
    body: JSON.stringify({ word: "Ubiquitous" })
  });

  console.log("-> Writing (should award 25 XP)");
  await fetch(`${API_URL}/ai/writing`, {
    method: "POST", headers: { "Content-Type": "application/json", "Cookie": userCookie },
    body: JSON.stringify({ text: "I am writing this essay to tell you that I am very good at English. Please hire me for the job. I think I will do good." })
  });

  console.log("-> Interview (should award 40 XP)");
  await fetch(`${API_URL}/ai/interview`, {
    method: "POST", headers: { "Content-Type": "application/json", "Cookie": userCookie },
    body: JSON.stringify({ 
      type: "HR", 
      transcript: [ { role: "model", content: "Tell me about yourself." }, { role: "user", content: "I am a software engineer." } ]
    })
  });

  console.log("-> Study Plan (should award 15 XP)");
  await fetch(`${API_URL}/ai/study-plan`, {
    method: "POST", headers: { "Content-Type": "application/json", "Cookie": userCookie },
    body: JSON.stringify({ currentLevel: "Intermediate", goal: "Pass IELTS", weakTopics: ["speaking", "vocabulary"] })
  });

  // Total XP should be 10 + 10 + 25 + 40 + 15 = 100 XP (Level 2).
  // Wait a moment for async DB tasks
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log("\nFetching Student Analytics...");
  const analyticsRes = await fetch(`${API_URL}/student/analytics`, {
    headers: { "Cookie": userCookie }
  });
  const analyticsData = await analyticsRes.json();
  
  console.log("--- Student Analytics Result ---");
  console.log("Current XP:", analyticsData.currentXp, "(Expected: 100)");
  console.log("Level:", analyticsData.level, "(Expected: 2)");
  console.log("Streak:", analyticsData.streak, "(Expected: 1)");
  console.log("AI Interactions:", analyticsData.aiUsageCount, "(Expected: 5)");
  console.log("Achievements Earned:", analyticsData.achievements.map((a) => a.title).join(", "));
  
  if (analyticsData.currentXp >= 100 && analyticsData.level >= 2 && analyticsData.streak >= 1) {
    console.log("✅ Student Analytics Passed!");
  } else {
    console.error("❌ Student Analytics Failed!");
  }

  console.log("\nFetching Admin Analytics...");
  const adminAnalyticsRes = await fetch(`${API_URL}/admin/analytics`, {
    headers: { "Cookie": adminCookie }
  });
  const adminAnalyticsData = await adminAnalyticsRes.json();
  
  console.log("--- Admin Analytics Result ---");
  console.log("Total Users:", adminAnalyticsData.totalUsers);
  console.log("Active Users:", adminAnalyticsData.activeUsers);
  console.log("Leaderboard Top User XP:", adminAnalyticsData.leaderboard[0]?.xp);
  
  if (adminAnalyticsData.totalUsers > 0) {
    console.log("✅ Admin Analytics Passed!");
  } else {
    console.error("❌ Admin Analytics Failed!");
  }
}

runTests();
