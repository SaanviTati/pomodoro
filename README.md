# Pomodoro Timer with Real-Time Phone Detection

## Overview

This project is a web-based Pomodoro timer that integrates a real-time phone detection system using AI. The goal is to help users maintain focus during work sessions by discouraging phone usage. The application runs entirely in the browser and utilizes the user's webcam to detect if a phone is being used. If a phone is detected, the app displays an alert to prompt the user to refocus. It also includes an embedded spotify study playlist.

## Features

### Pomodoro Timer
- Traditional 25-minute work sessions followed by 5-minute breaks
- Visual circular progress indicator
- Session type display (work or break)

### Phone Detection
- Accesses the user's webcam with permission
- Captures webcam frames at regular intervals
- If a phone is detected, a visible alert is triggered on the screen
- All processing is done client-side to ensure privacy

### User Interface and Experience
- Animated background using Three.js
- Embedded Spotify player for optional music playback

## How It Works

1. The user grants permission to access their webcam.
2. The application captures a frame from the video feed every 1.5 seconds.
3. The frame is analyzed using a locally loaded AI model trained to detect phones.
4. If a phone is identified in the frame, an on-screen alert appears to notify the user.

The AI model is pretrained and runs entirely in the browser, with no images or data sent to external servers.
