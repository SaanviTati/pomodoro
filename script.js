// Timer constants
const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

// Timer state
let timeLeft = WORK_TIME;
let isRunning = false;
let isWorkSession = true;
let timerInterval = null;

// DOM elements
const timeDisplay = document.getElementById('timeDisplay');
const timeRemaining = document.getElementById('timeRemaining');
const sessionType = document.getElementById('sessionType');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const btnIcon = document.getElementById('btnIcon');
const btnText = document.getElementById('btnText');
const progressCircle = document.getElementById('progressCircle');

// Calculate circle properties
const radius = 120;
const circumference = 2 * Math.PI * radius;

// Initialize the timer display
function init() {
    updateDisplay();
    updateProgress();
    updateSessionDisplay();
}

// Format time to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update the time display
function updateDisplay() {
    timeDisplay.textContent = formatTime(timeLeft);
    
    const minutesLeft = Math.ceil(timeLeft / 60);
    timeRemaining.textContent = `${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''} left`;
}

// Update the circular progress
function updateProgress() {
    const totalTime = isWorkSession ? WORK_TIME : BREAK_TIME;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    const offset = circumference - (progress / 100) * circumference;
    
    progressCircle.style.strokeDashoffset = offset;
}

// Update session type display
function updateSessionDisplay() {
    if (isWorkSession) {
        sessionType.textContent = '🍅 Work Session';
        progressCircle.classList.remove('break-mode');
    } else {
        sessionType.textContent = '☕ Break Time';
        progressCircle.classList.add('break-mode');
    }
}

// Update button appearance
function updateButton() {
    if (isRunning) {
        btnIcon.textContent = '⏸️';
        btnText.textContent = 'Pause';
        startStopBtn.classList.add('running');
    } else {
        btnIcon.textContent = '▶️';
        btnText.textContent = 'Start';
        startStopBtn.classList.remove('running');
    }
}

// Start the timer
function startTimer() {
    isRunning = true;
    updateButton();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        updateProgress();
        
        // Check if timer reached zero
        if (timeLeft <= 0) {
            handleTimerComplete();
        }
    }, 1000);
}

// Stop the timer
function stopTimer() {
    isRunning = false;
    updateButton();
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Handle timer completion
function handleTimerComplete() {
    stopTimer();
    
    // Switch session type
    isWorkSession = !isWorkSession;
    timeLeft = isWorkSession ? WORK_TIME : BREAK_TIME;
    
    // Update displays
    updateDisplay();
    updateProgress();
    updateSessionDisplay();
    
    // Add visual feedback
    document.querySelector('.timer-card').classList.add('session-transition');
    setTimeout(() => {
        document.querySelector('.timer-card').classList.remove('session-transition');
    }, 600);
    
    // Optional: Show notification or play sound
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${isWorkSession ? 'Work' : 'Break'} session started!`);
    }
}

// Toggle timer (start/stop)
function toggleTimer() {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
}

// Reset timer
function resetTimer() {
    stopTimer();
    timeLeft = isWorkSession ? WORK_TIME : BREAK_TIME;
    updateDisplay();
    updateProgress();
}

// Event listeners
startStopBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
    } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetTimer();
    }
});

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Page visibility handling (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isRunning) {
        // Optionally pause when tab becomes hidden
        // stopTimer();
    }
});

// Initialize the timer when page loads
init();
