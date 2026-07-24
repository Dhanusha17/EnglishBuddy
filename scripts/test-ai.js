import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api";

async function runTests() {
  console.log("--- Setup: Register & Login ---");
  const testEmail = `ai_test_${Date.now()}@englishbuddy.com`;
  
  // Register
  await fetch(`${API_URL}/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "AI Test User", email: testEmail, password: "Password@123" })
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
  
  console.log("Logged in. Testing AI Modules...\n");

  // 1. AI Chat
  console.log("1. Testing AI Chat...");
  const chatRes = await fetch(`${API_URL}/ai/chat`, {
    method: "POST", headers: { "Content-Type": "application/json", "Cookie": userCookie },
    body: JSON.stringify({ message: "Hello, I want to learn English!" })
  });
  console.log("Chat Status:", chatRes.status);
  
  // 2. Grammar Checker
  console.log("\n2. Testing Grammar Checker...");
  const grammarRes = await fetch(`${API_URL}/ai/grammar`, {
    method: "POST", headers: { "Content-Type": "application/json", "Cookie": userCookie },
    body: JSON.stringify({ text: "I is going to the store yesterday." })
  });
  console.log("Grammar Status:", grammarRes.status);

  // 3. Vocabulary Builder
  console.log("\n3. Testing Vocabulary Builder...");
  const vocabRes = await fetch(`${API_URL}/ai/vocabulary`, {
    method: "POST", headers: { "Content-Type": "application/json", "Cookie": userCookie },
    body: JSON.stringify({ word: "Ubiquitous" })
  });
  console.log("Vocabulary Status:", vocabRes.status);

  // 4. Writing Assistant
  console.log("\n4. Testing Writing Assistant...");
  const writingRes = await fetch(`${API_URL}/ai/writing`, {
    method: "POST", headers: { "Content-Type": "application/json", "Cookie": userCookie },
    body: JSON.stringify({ text: "I am writing this essay to tell you that I am very good at English. Please hire me for the job. I think I will do good." })
  });
  console.log("Writing Status:", writingRes.status);

  // 5. Interview Coach
  console.log("\n5. Testing Interview Coach...");
  const interviewRes = await fetch(`${API_URL}/ai/interview`, {
    method: "POST", headers: { "Content-Type": "application/json", "Cookie": userCookie },
    body: JSON.stringify({ 
      type: "HR", 
      transcript: [
        { role: "model", content: "Tell me about yourself." },
        { role: "user", content: "I am a software engineer." }
      ]
    })
  });
  console.log("Interview Status:", interviewRes.status);

  // 6. Study Planner
  console.log("\n6. Testing Study Planner...");
  const planRes = await fetch(`${API_URL}/ai/study-plan`, {
    method: "POST", headers: { "Content-Type": "application/json", "Cookie": userCookie },
    body: JSON.stringify({ 
      currentLevel: "Intermediate", 
      goal: "Pass IELTS", 
      weakTopics: ["speaking", "vocabulary"] 
    })
  });
  console.log("Planner Status:", planRes.status);
}

runTests();
