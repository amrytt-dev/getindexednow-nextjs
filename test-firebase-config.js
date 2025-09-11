// Simple test script to verify Firebase configuration
// Run with: node test-firebase-config.js

const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

console.log("🔍 Checking Firebase configuration...\n");

let allConfigured = true;

requiredEnvVars.forEach((envVar) => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${envVar}: NOT SET`);
    allConfigured = false;
  }
});

console.log("\n" + "=".repeat(50));

if (allConfigured) {
  console.log("🎉 All required Firebase environment variables are configured!");
  console.log("\n📝 Next steps:");
  console.log(
    "1. Make sure your Firebase project has Email/Password authentication enabled"
  );
  console.log(
    "2. Configure the password reset email template in Firebase Console"
  );
  console.log("3. Add your domain to authorized domains in Firebase Console");
  console.log("4. Test the forgot password flow at /forgot-password");
} else {
  console.log("⚠️  Some Firebase environment variables are missing!");
  console.log("\n📝 To fix this:");
  console.log("1. Create a .env.local file in the project root");
  console.log("2. Add the required Firebase configuration variables");
  console.log("3. See FIREBASE_PASSWORD_RESET_SETUP.md for details");
}

console.log("\n🔗 Firebase Console: https://console.firebase.google.com/");
