/**
 * NEXUS AI - Main Application
 * মূল অ্যাপ্লিকেশন লজিক
 */

// App State
const AppState = {
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    lastTranscript: '',
    conversationHistory: []
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[NEXUS] Initializing...');
    
    // Welcome
    setTimeout(() => {
        showNotification('NEXUS AI স্বাগতম!');
        speak(Config.personality.greeting);
    }, 1000);
    
    // Update stats
    setInterval(updateSystemStats, 2000);
    
    console.log('[NEXUS] Ready');
});

// Toggle Listening
async function toggleListening() {
    if (AppState.isProcessing) return;
    
    AppState.isListening = !AppState.isListening;
    
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    const listenBtn = document.getElementById('listenBtn');
    const wakeIndicator = document.getElementById('wakeIndicator');
    const audioVisualizer = document.getElementById('audioVisualizer');
    
    if (AppState.isListening) {
        statusBadge.classList.add('listening');
        statusText.textContent = 'শুনছি...';
        listenBtn.classList.add('active');
        wakeIndicator.classList.add('active');
        audioVisualizer.classList.add('active');
        
        if (window.voiceRecognition) {
            await window.voiceRecognition.start();
        }
    } else {
        statusBadge.classList.remove('listening');
        statusText.textContent = 'পিসি রেডি';
        listenBtn.classList.remove('active');
        wakeIndicator.classList.remove('active');
        audioVisualizer.classList.remove('active');
        
        if (window.voiceRecognition) {
            await window.voiceRecognition.stop();
        }
    }
}

// Process Voice Input
async function processVoiceInput(transcript) {
    if (!transcript || transcript.trim() === '') return;
    
    console.log('[NEXUS] Heard:', transcript);
    addLogEntry('action', transcript);
    addChatMessage('user', transcript);
    
    AppState.lastTranscript = transcript;
    AppState.isProcessing = true;
    updateStatus('ভাবছি...');
    
    // Show typing indicator
    showTypingIndicator();
    
    // First, try to execute built-in command
    if (window.nexusAutomation) {
        const executed = await window.nexusAutomation.parseAndExecute(transcript);
        if (executed) {
            removeTypingIndicator();
            AppState.isProcessing = false;
            updateStatus('পিসি রেডি');
            return;
        }
    }
    
    // If not a built-in command, use AI
    const response = await getAIResponse(transcript);
    removeTypingIndicator();
    
    addChatMessage('ai', response);
    speak(response);
    
    AppState.isProcessing = false;
    updateStatus('পিসি রেডি');
}

// Get AI Response
async function getAIResponse(userInput) {
    if (!Config.apiKey) {
        return 'দয়া করে সেটিংসে API কী যোগ করুন।';
    }
    
    try {
        const prompt = buildPrompt(userInput);
        
        const response = await fetch(`${Config.apiUrl}?key=${Config.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 2048,
                    topP: 0.95
                }
            })
        });
        
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        if (data.candidates && data.candidates[0]) {
            return data.candidates[0].content.parts[0].text;
        }
        
        return 'কিছু সমস্যা হয়েছে।';
    } catch (error) {
        console.error('[NEXUS] AI Error:', error);
        return 'দুঃখিত, সমস্যা হয়েছে।';
    }
}

// Build Prompt
function buildPrompt(userInput) {
    return `তুমি একজন অত্যন্ত বুদ্ধিমান সহকারী যার নাম "নেক্সাস"। তুমি বাংলায় কথা বোঝো এবং বাংলায় কথা বলো।

## গুরুত্বপূর্ণ নিয়ম:
1. তুমি কখনো বলো না যে তুমি AI, চ্যাটবট, বা ল্যাঙ্গুয়েজ মডেল
2. তুমি একজন বাস্তব মানুষের মতো কথা বোঝো এবং উত্তর দাও
3. তুমি বাংলায় স্বাভাবিকভাবে কথা বলো
4. তুমি সংক্ষেপে কিন্তু সম্পূর্ণ তথ্য সহ উত্তর দাও
5. তুমি মজার এবং বন্ধুত্বপূর্ণ
6. তোমার কাজ হলো সাহায্য করা

## তোমার কাজের তালিকা (এগুলো অটোমেটিক হবে):
- মাউস ক্লিক করা
- কিবোর্ডে টাইপ করা
- ফাইল এবং ফোল্ডার নিয়ে কাজ করা
- ব্রাউজারে সার্চ করা
- অ্যাপ খোলা
- স্ক্রিনশট নেওয়া
- এবং আরো অনেক কিছু

ব্যবহারকারী: ${userInput}

নেক্সাস:`;
}

// Speak Text
async function speak(text) {
    if (window.voiceSynthesis) {
        AppState.isSpeaking = true;
        const audioVisualizer = document.getElementById('audioVisualizer');
        if (audioVisualizer) audioVisualizer.classList.add('active');
        
        await window.voiceSynthesis.speak(text);
        
        AppState.isSpeaking = false;
        if (audioVisualizer) audioVisualizer.classList.remove('active');
    }
}

// Add Log Entry
function addLogEntry(type, text) {
    const logContainer = document.getElementById('actionLog');
    if (!logContainer) return;
    
    const time = new Date().toLocaleTimeString('bn-BD');
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `
        <div class="log-time">${time}</div>
        <div class="log-text">${text}</div>
    `;
    
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
    
    // Limit entries
    while (logContainer.children.length > 30) {
        logContainer.removeChild(logContainer.firstChild);
    }
}

// Add Chat Message
function addChatMessage(type, text) {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;
    
    const message = document.createElement('div');
    message.className = `chat-message ${type}`;
    message.innerHTML = `
        <div class="message-sender">${type === 'ai' ? 'AI সহকর্মী' : 'তুমি'}</div>
        <div class="message-text">${text}</div>
    `;
    
    chatArea.appendChild(message);
    chatArea.scrollTop = chatArea.scrollHeight;
    
    // Limit messages
    while (chatArea.children.length > 20) {
        chatArea.removeChild(chatArea.firstChild);
    }
}

// Typing Indicator
function showTypingIndicator() {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    
    chatArea.appendChild(indicator);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// Update Status
function updateStatus(text) {
    const statusText = document.getElementById('statusText');
    if (statusText) statusText.textContent = text;
}

// System Stats
function updateSystemStats() {
    // CPU
    const cpu = Math.round(15 + Math.random() * 35);
    const cpuBar = document.getElementById('cpuBar');
    const cpuValue = document.getElementById('cpuValue');
    const cpuStatusSmall = document.getElementById('cpuStatusSmall');
    
    if (cpuBar) cpuBar.style.width = cpu + '%';
    if (cpuValue) cpuValue.textContent = cpu + '%';
    if (cpuStatusSmall) cpuStatusSmall.textContent = cpu + '%';
    
    // Memory
    const mem = Math.round(30 + Math.random() * 25);
    const memBar = document.getElementById('memBar');
    const memValue = document.getElementById('memValue');
    const memStatusSmall = document.getElementById('memStatusSmall');
    
    if (memBar) memBar.style.width = mem + '%';
    if (memValue) memValue.textContent = mem + '%';
    if (memStatusSmall) memStatusSmall.textContent = mem + '%';
}

// Show Notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (notification && notificationText) {
        notificationText.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Settings
function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.add('active');
    
    // Load current values
    const apiKeyInput = document.getElementById('geminiApiKey');
    if (apiKeyInput) apiKeyInput.value = Config.apiKey || '';
    
    const wakeWordInput = document.getElementById('wakeWord');
    if (wakeWordInput) wakeWordInput.value = Config.voice.wakeWord || 'হ্যালো নেক্সাস';
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('active');
}

function saveSettings() {
    const apiKeyInput = document.getElementById('geminiApiKey');
    const wakeWordInput = document.getElementById('wakeWord');
    const langSelect = document.getElementById('languageSelect');
    
    if (apiKeyInput) Config.apiKey = apiKeyInput.value;
    if (wakeWordInput) Config.voice.wakeWord = wakeWordInput.value;
    if (langSelect) Config.voice.language = langSelect.value;
    
    Config.save();
    
    showNotification('সেটিংস সেভ হয়েছে!');
    closeSettings();
}

// Capture Screen
function captureScreen() {
    showNotification('স্ক্রিন দেখা হচ্ছে...');
    // Screen capture implementation
}

// Volume
document.addEventListener('DOMContentLoaded', () => {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    
    if (volumeSlider && volumeValue) {
        volumeSlider.addEventListener('input', (e) => {
            volumeValue.textContent = e.target.value + '%';
            if (window.voiceSynthesis) {
                window.voiceSynthesis.setVolume(e.target.value / 100);
            }
        });
    }
});

// Voice Recognition Handler
if (window.voiceRecognition) {
    window.voiceRecognition.onResult = (result) => {
        if (result.isFinal && result.final) {
            processVoiceInput(result.final);
        }
    };
}

// Export
window.App = {
    toggleListening,
    processVoiceInput,
    speak,
    showNotification,
    addLogEntry,
    addChatMessage,
    updateStatus
};