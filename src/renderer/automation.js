/**
 * NEXUS AI - Automation Module
 * মাউস ও কিবোর্ড কন্ট্রোল
 */

class Automation {
    constructor() {
        this.isEnabled = true;
        this.lastAction = null;
        this.actionHistory = [];
    }
    
    init() {
        console.log('[Automation] Initialized');
    }
    
    // Move mouse to position
    async moveMouse(x, y) {
        if (!this.isEnabled) return false;
        
        try {
            if (window.nexusAI) {
                const success = await window.nexusAI.mouseMove(x, y);
                
                if (success) {
                    this.lastAction = { type: 'move', x, y, time: Date.now() };
                    this.addToHistory('মাউস সরানো হয়েছে', `(${x}, ${y})`);
                }
                
                return success;
            }
        } catch (error) {
            console.error('[Automation] Move mouse error:', error);
        }
        
        return false;
    }
    
    // Click at current position
    async click(button = 'left') {
        if (!this.isEnabled) return false;
        
        try {
            if (window.nexusAI) {
                const success = await window.nexusAI.mouseClick(button);
                
                if (success) {
                    this.lastAction = { type: 'click', button, time: Date.now() };
                    this.addToHistory(`${button === 'right' ? 'রাইট' : 'বাম'} ক্লিক`, '');
                }
                
                return success;
            }
        } catch (error) {
            console.error('[Automation] Click error:', error);
        }
        
        return false;
    }
    
    // Double click
    async doubleClick() {
        if (!this.isEnabled) return false;
        
        try {
            if (window.nexusAI) {
                const success = await window.nexusAI.mouseDoubleClick();
                
                if (success) {
                    this.lastAction = { type: 'doubleClick', time: Date.now() };
                    this.addToHistory('ডাবল ক্লিক', '');
                }
                
                return success;
            }
        } catch (error) {
            console.error('[Automation] Double click error:', error);
        }
        
        return false;
    }
    
    // Type text
    async typeText(text) {
        if (!this.isEnabled) return false;
        
        try {
            if (window.nexusAI) {
                const success = await window.nexusAI.keyType(text);
                
                if (success) {
                    this.lastAction = { type: 'type', text, time: Date.now() };
                    this.addToHistory('টাইপ করা হয়েছে', `"${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
                }
                
                return success;
            }
        } catch (error) {
            console.error('[Automation] Type error:', error);
        }
        
        return false;
    }
    
    // Press a key
    async pressKey(key) {
        if (!this.isEnabled) return false;
        
        try {
            if (window.nexusAI) {
                const success = await window.nexusAI.keyPress(key);
                
                if (success) {
                    this.lastAction = { type: 'keyPress', key, time: Date.now() };
                    this.addToHistory(`কী প্রেস`, key);
                }
                
                return success;
            }
        } catch (error) {
            console.error('[Automation] Key press error:', error);
        }
        
        return false;
    }
    
    // Press key combination (e.g., Ctrl+C)
    async pressKeys(...keys) {
        if (!this.isEnabled) return false;
        
        try {
            if (window.nexusAI) {
                const success = await window.nexusAI.keyCombination(keys);
                
                if (success) {
                    this.lastAction = { type: 'keyCombo', keys, time: Date.now() };
                    this.addToHistory('কী কম্বিনেশন', keys.join(' + '));
                }
                
                return success;
            }
        } catch (error) {
            console.error('[Automation] Key combination error:', error);
        }
        
        return false;
    }
    
    // Complex actions
    async selectAll() {
        return await this.pressKeys('ctrl', 'a');
    }
    
    async copy() {
        return await this.pressKeys('ctrl', 'c');
    }
    
    async paste() {
        return await this.pressKeys('ctrl', 'v');
    }
    
    async cut() {
        return await this.pressKeys('ctrl', 'x');
    }
    
    async undo() {
        return await this.pressKeys('ctrl', 'z');
    }
    
    async redo() {
        return await this.pressKeys('ctrl', 'shift', 'z');
    }
    
    async save() {
        return await this.pressKeys('ctrl', 's');
    }
    
    async closeTab() {
        return await this.pressKeys('ctrl', 'w');
    }
    
    async newTab() {
        return await this.pressKeys('ctrl', 't');
    }
    
    async refresh() {
        return await this.pressKeys('ctrl', 'r');
    }
    
    async openDevTools() {
        return await this.pressKeys('ctrl', 'shift', 'i');
    }
    
    // Execute command based on Bengali text
    async executeCommand(commandText) {
        const text = commandText.toLowerCase().trim();
        
        // Common commands
        if (text.includes('ক্লিক কর') || text.includes('ট্যাপ কর')) {
            return await this.click();
        }
        
        if (text.includes('ডাবল ক্লিক কর')) {
            return await this.doubleClick();
        }
        
        if (text.includes('রাইট ক্লিক কর')) {
            return await this.click('right');
        }
        
        if (text.includes('সিলেক্ট অল') || text.includes('সব সিলেক্ট কর')) {
            return await this.selectAll();
        }
        
        if (text.includes('কপি কর')) {
            return await this.copy();
        }
        
        if (text.includes('পেস্ট কর')) {
            return await this.paste();
        }
        
        if (text.includes('কাট কর')) {
            return await this.cut();
        }
        
        if (text.includes('আনডু কর')) {
            return await this.undo();
        }
        
        if (text.includes('রিডু কর')) {
            return await this.redo();
        }
        
        if (text.includes('সেভ কর')) {
            return await this.save();
        }
        
        if (text.includes('রিফ্রেশ কর')) {
            return await this.refresh();
        }
        
        if (text.includes('নিউ ট্যাব') || text.includes('নতুন ট্যাব')) {
            return await this.newTab();
        }
        
        if (text.includes('ক্লোজ ট্যাব') || text.includes('বন্ধ কর')) {
            return await this.closeTab();
        }
        
        // Enter/Escape shortcuts
        if (text.includes('এন্টার') || text.includes('ওকে') || text.includes('সাবমিট')) {
            return await this.pressKey('enter');
        }
        
        if (text.includes('বাতিল') || text.includes('ব্যাক')) {
            return await this.pressKey('escape');
        }
        
        // Tab navigation
        if (text.includes('ট্যাব') || text.includes('এগিয়ে যাও')) {
            return await this.pressKey('tab');
        }
        
        if (text.includes('শিফট ট্যাব') || text.includes('পিছনে যাও')) {
            return await this.pressKeys('shift', 'tab');
        }
        
        console.log('[Automation] Unknown command:', text);
        return false;
    }
    
    // Parse and execute complex commands with positions
    async executeComplexCommand(commandText) {
        // Look for position patterns like "এখানে ক্লিক কর", "ওখানে", etc.
        // For now, use the last known position
        const text = commandText.toLowerCase();
        
        if (text.includes('ওখানে') || text.includes('এখানে') || text.includes('সেখানে')) {
            // Use last action position if available
            if (this.lastAction && this.lastAction.x !== undefined) {
                await this.moveMouse(this.lastAction.x, this.lastAction.y);
                return await this.click();
            }
        }
        
        // Look for scrolling commands
        if (text.includes('উপরে স্ক্রল') || text.includes('উপরে যাও')) {
            for (let i = 0; i < 5; i++) {
                await this.pressKey('up');
                await this.delay(100);
            }
            return true;
        }
        
        if (text.includes('নিচে স্ক্রল') || text.includes('নিচে যাও')) {
            for (let i = 0; i < 5; i++) {
                await this.pressKey('down');
                await this.delay(100);
            }
            return true;
        }
        
        // Look for delete command
        if (text.includes('ডিলিট') || text.includes('মুছে ফেল')) {
            return await this.pressKey('backspace');
        }
        
        return false;
    }
    
    addToHistory(action, detail) {
        const entry = { action, detail, time: Date.now() };
        this.actionHistory.unshift(entry);
        
        // Keep only last 20 actions
        if (this.actionHistory.length > 20) {
            this.actionHistory.pop();
        }
        
        // Log to UI
        if (window.App) {
            window.App.addLogEntry('action', `${action} ${detail}`.trim());
        }
    }
    
    getHistory() {
        return this.actionHistory;
    }
    
    getLastAction() {
        return this.lastAction;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    setEnabled(enabled) {
        this.isEnabled = enabled;
        console.log('[Automation] Enabled:', enabled);
    }
}

// Initialize
function initAutomation() {
    const automation = new Automation();
    automation.init();
    window.automation = automation;
    console.log('[Automation] Ready');
}