const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Sign in with Google
document.getElementById('googleLoginBtn').addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      alert(`Welcome, ${user.displayName}`);
      // Redirect or show Pomodoro page
      window.location.href = "pomodoro.html"; 
    })
    .catch(error => {
      console.error(error);
    });
});
