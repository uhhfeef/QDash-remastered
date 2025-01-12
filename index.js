/**
 * @fileoverview Main entry point for the application
 */

import './styles/styles.css';

// Defer loading heavy dependencies
const loadAppDependencies = async () => {
    const { initDuckDB } = await import('./services/duckDbConfig.js');
    const { handleChatSubmit } = await import('./controller/chatController.js');
    const { setupEventListeners, updateUserInitial } = await import('./modules/uiUtils.js');
    const { initialize, handleFileUpload } = await import('./services/duckDbService.js');
    const { updateTools } = await import('./services/config.js');
    
    return {
        initDuckDB,
        handleChatSubmit,
        setupEventListeners,
        initialize,
        updateTools,
        handleFileUpload,
        updateUserInitial
    };
};

let initialized = false;

// Initialize the application
const initApp = async () => {
    // If already initialized or on login page, do nothing
    if (initialized || window.location.pathname === '/login') {
        return;
    }
    
    // Only load app if we're on main page
    if (window.location.pathname === '/') {
        console.log('[DEBUG] Initializing app...');
        try {
            const {
                initDuckDB,
                handleChatSubmit,
                setupEventListeners,
                initialize,
                updateTools,
                handleFileUpload,
                updateUserInitial
            } = await loadAppDependencies();

            // Update user initial in UI
            await updateUserInitial();

            // Initialize DuckDB once
            const connection = await initDuckDB();
            await initialize(connection);

            // Setup event listeners
            setupEventListeners({
                handleChatSubmit,
                handleFileUpload,
                updateTools,
                updateFilesList: window.updateFilesList
            });

            initialized = true;
            console.log('[DEBUG] App initialized successfully');
        } catch (error) {
            console.error('[DEBUG] Error initializing app:', error);
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
