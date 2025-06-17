// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDmCqm9UqIeLzmL3WH9_XAOlxQi7v1z5J8",
  authDomain: "pomodoro-80afd.firebaseapp.com",
  projectId: "pomodoro-80afd",
  storageBucket: "pomodoro-80afd.appspot.com",
  messagingSenderId: "1007443609407",
  appId: "1:1007443609407:web:4ee27095c9e0bf071ab58a",
  measurementId: "G-9X04Q0BHCD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Buttons
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");

// Login
loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Logged in as", result.user.displayName);
    })
    .catch((error) => {
      console.error("Login error:", error);
    });
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out");
    })
    .catch((error) => {
      console.error("Sign out error:", error);
    });
});

// Handle Auth State
onAuthStateChanged(auth, (user) => {
  if (user) {
    userInfo.innerText = `Signed in as: ${user.displayName}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    userInfo.innerText = "";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
});
