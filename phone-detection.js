// Phone detection using TensorFlow.js COCO-SSD model
let model = null;
let isDetecting = false;
let phoneDetected = false;

// Initialize the detection system
async function initPhoneDetection() {
    const video = document.getElementById('webcam');
    const alertDiv = document.getElementById('phoneAlert');
    const statusDiv = document.getElementById('detectionStatus');
    
    try {
        // Load the AI model
        statusDiv.textContent = 'Loading AI model...';
        model = await cocoSsd.load();
        
        // Setup webcam
        statusDiv.textContent = 'Setting up camera...';
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
        });
        video.srcObject = stream;
        
        // Wait for video to load
        await new Promise(resolve => video.onloadedmetadata = resolve);
        
        statusDiv.textContent = 'Phone detection active';
        
        // Start detection loop
        detectPhone();
        
    } catch (error) {
        console.error('Error initializing phone detection:', error);
        statusDiv.textContent = 'Camera access denied';
    }
}

// Detect phone in the video using AI
async function detectPhone() {
    if (!model || isDetecting) return;
    
    isDetecting = true;
    const video = document.getElementById('webcam');
    const alertDiv = document.getElementById('phoneAlert');
    
    try {
        // Run AI detection
        const predictions = await model.detect(video);
        
        // Check for phone in AI predictions
        const phoneFound = predictions.some(prediction => 
            prediction.class === 'cell phone' && prediction.score > 0.5
        );
        
        // Show and Hide alert based on detection
        if (phoneFound && !phoneDetected) {
            phoneDetected = true;
            alertDiv.style.display = 'block';
            console.log('Phone detected!');
        } else if (!phoneFound && phoneDetected) {
            phoneDetected = false;
            alertDiv.style.display = 'none';
            console.log('Phone no longer detected');
        }
        
    } catch (error) {
        console.error('Detection error:', error);
    }
    
    isDetecting = false;

    // Continue detection loop every 50 milliseconds
    setTimeout(detectPhone, 50);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initPhoneDetection)