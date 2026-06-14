/**
 * NEXUS AI - Main Application
 * মূল অ্যাপ্লিকেশন লজিক
 */

// App State
const AppState = {
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    isOrbActive: false,
    lastTranscript: '',
    conversationHistory: [],
    screenshotMode: false
};

// DOM Elements
let elements = {};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[NEXUS] Initializing application...');
    
    // Cache DOM elements
    cacheElements();
    
    // Start background tasks
    initMatrixBackground();
    initDateTime();
    initAudioVisualizer();
    initOrbInteraction();
    
    // Initialize modules
    await initFaceRecognition();
    await initVoiceRecognition();
    initVoiceSynthesis();
    initScreenCapture();
    initAutomation();
    
    // Load saved settings
    loadSettings();
    
    // Welcome message
    setTimeout(() => {
        showNotification('NEXUS AI স্বাগতম!');
        speak(Config.personality.greeting);
    }, 1000);
    
    console.log('[NEXUS] Application initialized');
});

// Cache DOM elements for performance
function cacheElements() {
    elements = {
        statusIndicator: document.getElementById('statusIndicator'),
        statusText: document.getElementById('statusText'),
        actionLog: document.getElementById('actionLog'),
        responseLog: document.getElementById('responseLog'),
        listenBtn: document.getElementById('listenBtn'),
        audioVisualizer: document.getElementById('audioVisualizer'),
        volumeSlider: document.getElementById('volumeSlider'),
        volumeValue: document.getElementById('volumeValue'),
        wakeIndicator: document.getElementById('wakeIndicator'),
        orbContainer: document.getElementById('orbContainer'),
        faceCamera: document.getElementById('faceCamera'),
        faceOverlay: document.getElementById('faceOverlay'),
        faceStatus: document.getElementById('faceStatus'),
        settingsModal: document.getElementById('settingsModal'),
        screenModal: document.getElementById('screenModal'),
        notification: document.getElementById('notification'),
        notificationText: document.getElementById('notificationText'),
        geminiApiKey: document.getElementById('geminiApiKey'),
        wakeWord: document.getElementById('wakeWord'),
        languageSelect: document.getElementById('languageSelect'),
        outputLangSelect: document.getElementById('outputLangSelect'),
        cameraSelect: document.getElementById('cameraSelect'),
        faceRecogToggle: document.getElementById('faceRecogToggle'),
        screenCaptureToggle: document.getElementById('screenCaptureToggle'),
        autoListenToggle: document.getElementById('autoListenToggle'),
        cpuStatus: document.getElementById('cpuStatus'),
        memStatus: document.getElementById('memStatus')
    };
    
    // Volume slider event
    elements.volumeSlider.addEventListener('input', (e) => {
        elements.volumeValue.textContent = e.target.value + '%';
        setVolume(e.target.value / 100);
    });
}

// Matrix Background Animation
function initMatrixBackground() {
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Matrix characters
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 50);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// DateTime Display
function initDateTime() {
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        document.getElementById('datetime').textContent = now.toLocaleDateString('bn-BD', options);
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// Audio Visualizer Animation
function initAudioVisualizer() {
    const bars = document.querySelectorAll('.audio-bar');
    
    // Random animation for demo
    setInterval(() => {
        if (AppState.isListening || AppState.isSpeaking) {
            bars.forEach(bar => {
                bar.style.height = Math.random() * 40 + 10 + 'px';
            });
        } else {
            bars.forEach(bar => {
                bar.style.height = '10px';
            });
        }
    }, 100);
}

// Orb Interaction
function initOrbInteraction() {
    const orbContainer = elements.orbContainer;
    
    // Click to toggle listening
    orbContainer.addEventListener('click', () => {
        toggleListening();
    });
    
    // Visual feedback on orb
    orbContainer.addEventListener('mouseenter', () => {
        if (!AppState.isListening) {
            orbContainer.style.transform = 'scale(1.05)';
        }
    });
    
    orbContainer.addEventListener('mouseleave', () => {
        if (!AppState.isListening) {
            orbContainer.style.transform = 'scale(1)';
        }
    });
}

// Toggle Listening Mode
async function toggleListening() {
    if (AppState.isProcessing) {
        showNotification('একটু অপেক্ষা করুন...');
        return;
    }
    
    AppState.isListening = !AppState.isListening;
    
    if (AppState.isListening) {
        startListening();
    } else {
        stopListening();
    }
}

// Start Voice Recognition
async function startListening() {
    console.log('[NEXUS] Starting voice recognition...');
    
    AppState.isListening = true;
    elements.listenBtn.classList.add('active');
    elements.statusIndicator.classList.add('listening');
    elements.statusText.textContent = 'শুনছি...';
    elements.wakeIndicator.classList.add('active');
    elements.audioVisualizer.classList.add('active');
    
    if (window.voiceRecognition) {
        await window.voiceRecognition.start();
    }
}

// Stop Voice Recognition
async function stopListening() {
    console.log('[NEXUS] Stopping voice recognition...');
    
    AppState.isListening = false;
    elements.listenBtn.classList.remove('active');
    elements.statusIndicator.classList.remove('listening');
    elements.statusText.textContent = 'প্রস্তুত';
    elements.wakeIndicator.classList.remove('active');
    elements.audioVisualizer.classList.remove('active');
    
    if (window.voiceRecognition) {
        await window.voiceRecognition.stop();
    }
}

// Process Voice Input
async function processVoiceInput(transcript) {
    if (!transcript || transcript.trim() === '') return;
    
    console.log('[NEXUS] Processing:', transcript);
    
    // Add to action log
    addLogEntry('action', transcript);
    AppState.lastTranscript = transcript;
    
    // Check for wake word
    if (transcript.toLowerCase().includes(Config.voice.wakeWord.toLowerCase())) {
        speak('হ্যাঁ, বলুন।');
        return;
    }
    
    // Show processing state
    AppState.isProcessing = true;
    elements.statusText.textContent = 'ভাবছি...';
    
    // Get AI response
    const response = await getAIResponse(transcript);
    
    // Add to response log
    addLogEntry('ai', response);
    
    // Speak the response
    speak(response);
    
    // Reset state
    AppState.isProcessing = false;
    elements.statusText.textContent = 'প্রস্তুত';
}

// Get AI Response from Gemini
async function getAIResponse(userInput) {
    if (!Config.apiKey) {
        return 'দয়া করে সেটিংসে জেমিনি API কী যোগ করুন।';
    }
    
    try {
        // Add to conversation history
        AppState.conversationHistory.push({
            role: 'user',
            parts: [{ text: userInput }]
        });
        
        // Build prompt for Bengali response
        const prompt = `তুমি একজন বাংলায় কথা বলা বুদ্ধিমান AI সহকারী। তোমার নাম "নেক্সাস"। 
        
ব্যবহারকারী বাংলায় কথা বলছে। তুমি সবসময় বাংলায় উত্তর দেবে।

নির্দেশনা:
1. সবসময় বাংলায় কথা বলো
2. প্রয়োজনে কম্পিউটারে কাজ করে দাও
3. স্ক্রিন দেখে বুঝে কাজ করো
4. মাউস ও কিবোর্ড কন্ট্রোল করতে পারো
5. কখনো বলো না যে তুমি AI বা চ্যাটবট
6. স্বাভাবিক মানুষের মতো কথা বলো
7. সংক্ষেপে উত্তর দাও কিন্তু সম্পূর্ণ তথ্য দাও

ব্যবহারকারী: ${userInput}

নেক্সাস:`;
        
        const response = await fetch(`${Config.apiUrl}?key=${Config.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 2048,
                    topP: 0.95,
                    topK: 40
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            
            // Add to history
            AppState.conversationHistory.push({
                role: 'model',
                parts: [{ text: aiResponse }]
            });
            
            // Keep history limited
            if (AppState.conversationHistory.length > 20) {
                AppState.conversationHistory = AppState.conversationHistory.slice(-20);
            }
            
            return aiResponse;
        }
        
        return 'কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।';
        
    } catch (error) {
        console.error('[NEXUS] AI Error:', error);
        return 'দুঃখিত, কিছু সমস্যা হয়েছে। ' + error.message;
    }
}

// Add Log Entry
function addLogEntry(type, text) {
    const time = new Date().toLocaleTimeString('bn-BD');
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-text">${text}</span>
    `;
    
    // Determine which log to add to
    const targetLog = type === 'user' || type === 'action' ? elements.actionLog : elements.responseLog;
    
    targetLog.appendChild(entry);
    targetLog.scrollTop = targetLog.scrollHeight;
    
    // Limit entries
    while (targetLog.children.length > 50) {
        targetLog.removeChild(targetLog.firstChild);
    }
}

// Speak Text
async function speak(text) {
    if (window.voiceSynthesis) {
        AppState.isSpeaking = true;
        elements.audioVisualizer.classList.add('active');
        await window.voiceSynthesis.speak(text);
        AppState.isSpeaking = false;
        elements.audioVisualizer.classList.remove('active');
    }
}

// Set Volume
function setVolume(level) {
    if (window.voiceSynthesis) {
        window.voiceSynthesis.setVolume(level);
    }
}

// Show Notification
function showNotification(message) {
    elements.notificationText.textContent = message;
    elements.notification.classList.add('show');
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

// Settings Functions
function openSettings() {
    elements.settingsModal.classList.add('active');
    loadSettings();
}

function closeSettings() {
    elements.settingsModal.classList.remove('active');
}

async function loadSettings() {
    // Load saved values
    elements.geminiApiKey.value = Config.apiKey || '';
    elements.wakeWord.value = Config.voice.wakeWord || 'হ্যালো নেক্সাস';
    elements.languageSelect.value = Config.voice.language || 'bn-BD';
    elements.outputLangSelect.value = Config.voice.outputLanguage || 'bn';
    elements.faceRecogToggle.checked = Config.faceRecognition.enabled;
    elements.screenCaptureToggle.checked = Config.screenCapture.enabled;
    elements.autoListenToggle.checked = Config.voice.alwaysListen;
    
    // Load cameras
    await loadCameras();
}

function saveSettings() {
    Config.apiKey = elements.geminiApiKey.value;
    Config.voice.wakeWord = elements.wakeWord.value;
    Config.voice.language = elements.languageSelect.value;
    Config.voice.outputLanguage = elements.outputLangSelect.value;
    Config.voice.recognitionLang = elements.languageSelect.value;
    Config.voice.synthesisLang = elements.outputLangSelect.value === 'bn' ? 'bn-BD' : 'en-US';
    Config.faceRecognition.enabled = elements.faceRecogToggle.checked;
    Config.screenCapture.enabled = elements.screenCaptureToggle.checked;
    Config.voice.alwaysListen = elements.autoListenToggle.checked;
    
    Config.save();
    
    // Update voice recognition
    if (window.voiceRecognition) {
        window.voiceRecognition.setLanguage(Config.voice.recognitionLang);
    }
    
    // Update voice synthesis
    if (window.voiceSynthesis) {
        window.voiceSynthesis.setLanguage(Config.voice.synthesisLang);
    }
    
    // Update camera visibility
    const cameraContainer = document.getElementById('faceCameraContainer');
    cameraContainer.style.display = Config.faceRecognition.enabled ? 'block' : 'none';
    
    showNotification('সেটিংস সেভ হয়েছে!');
    closeSettings();
}

async function loadCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        
        elements.cameraSelect.innerHTML = '<option value="">নির্বাচন করুন</option>';
        
        cameras.forEach((camera, index) => {
            const option = document.createElement('option');
            option.value = camera.deviceId;
            option.textContent = camera.label || `ক্যামেরা ${index + 1}`;
            elements.cameraSelect.appendChild(option);
        });
    } catch (error) {
        console.error('[NEXUS] Error loading cameras:', error);
    }
}

// Screen Capture Functions
function captureScreen() {
    elements.screenModal.classList.add('active');
    AppState.screenshotMode = true;
    
    if (window.screenCapture) {
        window.screenCapture.startCapture();
    }
}

function closeScreenModal() {
    elements.screenModal.classList.remove('active');
    AppState.screenshotMode = false;
    
    if (window.screenCapture) {
        window.screenCapture.stopCapture();
    }
}

async function screenAction(action) {
    const typeInput = document.getElementById('typeInput');
    const text = typeInput.value;
    
    if (action === 'type' && text) {
        await window.automation?.typeText(text);
        typeInput.value = '';
    } else if (action === 'click') {
        await window.automation?.click();
    } else if (action === 'doubleclick') {
        await window.automation?.doubleClick();
    } else if (action === 'rightclick') {
        await window.automation?.rightClick();
    }
    
    // Update screen after action
    if (window.screenCapture) {
        window.screenCapture.updateCapture();
    }
}

// System Status Updates
function updateSystemStatus() {
    if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(memory.jsHeapSizeLimit / 1048576);
        elements.memStatus.textContent = `${usedMB}/${totalMB}MB`;
    }
    
    // Simulate CPU usage
    const cpu = Math.round(20 + Math.random() * 30);
    elements.cpuStatus.textContent = cpu + '%';
}

setInterval(updateSystemStatus, 5000);
updateSystemStatus();

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('[NEXUS Error]', message, source, lineno, colno, error);
    addLogEntry('system', 'ত্রুটি: ' + message);
};

window.onunhandledrejection = function(event) {
    console.error('[NEXUS Unhandled Promise]', event.reason);
    addLogEntry('system', 'ত্রুটি: ' + event.reason);
};

// Export for use by other modules
window.AppState = AppState;
window.App = {
    processVoiceInput,
    speak,
    showNotification,
    addLogEntry
};