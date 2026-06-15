/**
 * NEXUS NEURAL NETWORK - Core Index
 * সব কোর মডিউল এক্সপোর্ট
 */

// Core components
const NEXUSCore = {
    // Model
    Model: window.NEXUSModel,
    
    // Layers
    Layers: window.NEXUS_LAYERS,
    
    // Activations
    Activations: window.NEXUS_ACTIVATIONS,
    Vectorized: window.NEXUS_VECTORIZED,
    
    // Loss
    Loss: window.NEXUS_LOSS,
    
    // Metrics
    Metrics: window.NEXUS_METRICS,
    
    // Initialize
    init() {
        console.log('[NEXUS Neural Network] Core initialized');
        console.log('[NEXUS] Available:', Object.keys(this));
        return this;
    }
};

// Auto-initialize
NEXUSCore.init();

// Export
window.NEXUSCore = NEXUSCore;
