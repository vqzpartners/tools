/**
 * Broadcast.js - Manual notification and logging system for GitHub Pages
 * Add your notices directly to this file in the 'notices' array
 */

const Broadcast = (function() {
    // Configuration
    const config = {
        noticeDisplayTime: 15000, // How long to show notices by default (ms)
        maxLogEntries: 50         // Maximum number of log entries to keep
    };

    // Store for logs and current notice
    const store = {
        logs: [],
        currentNotice: null,
        noticeTimer: null
    };

    /**
     * MANUAL NOTICES CONFIGURATION
     * 
     * Add new notices at the TOP of this array (newest first)
     * Each notice needs:
     *   - id: A unique identifier (increment for each new notice)
     *   - message: The text to display
     *   - importance: "info", "warning", "update", "alert" (affects styling)
     *   - timestamp: When the notice was created (ISO format date string)
     */
    const notices = [
        {
            id: 7, 
            message: "Distrubute your X posts easily with our Quote Generator", 
            importance: "update", 
            timestamp: "2025-04-02T02:42:00Z"
        },
        {
            id: 6, 
            message: "Verify a domain SSL status, without getting cached. (REMOVED)", 
            importance: "warning", 
            timestamp: "2025-03-10T02:42:00Z"
        },
        {
            id: 5, 
            message: "Huge update for X profile, business & affiliate badges added", 
            importance: "update", 
            timestamp: "2025-02-27T10:00:00Z"
        },
        {
            id: 4, 
            message: "WhatsApp link generator has been updated with new features!", 
            importance: "update", 
            timestamp: "2025-02-27T10:00:00Z"
        },
        {
            id: 3, 
            message: "System maintenance scheduled for tomorrow at 2 AM UTC", 
            importance: "warning", 
            timestamp: "2025-02-26T15:30:00Z"
        },
        {
            id: 2, 
            message: "New tool coming soon: Color Palette Generator", 
            importance: "info", 
            timestamp: "2025-02-25T12:45:00Z"
        },
        {
            id: 1, 
            message: "Welcome to Web Tools Collection! Explore our tools.", 
            importance: "info", 
            timestamp: "2025-02-24T09:00:00Z"
        }
    ];

    /**
     * Initialize the broadcast system
     */
    function init() {
        // Add initial log entry
        addLogEntry("Broadcast system initialized");
        
        // Display the most recent notice
        if (notices.length > 0) {
            const latestNotice = notices[0]; // Get the first notice (newest)
            displayNotice(latestNotice);
            addLogEntry(`Displaying notice: ${latestNotice.message}`, latestNotice.importance);
        } else {
            addLogEntry("No notices available");
        }
        
        // Initialize log display
        updateLogsUI();
        
        // Set up close button handler
        setupCloseButton();
        
        // Log initialization complete
        addLogEntry("Broadcast system ready");
    }

    /**
     * Set up the close button for notice banner
     */
    function setupCloseButton() {
        const closeBtn = document.getElementById('closeNotice');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                hideNotice();
                addLogEntry("Notice manually closed by user");
            });
        } else {
            console.error("Close button element not found");
        }
    }

    /**
     * Hide the current notice
     */
    function hideNotice() {
        const banner = document.getElementById('noticeBanner');
        if (banner) {
            banner.classList.remove('active');
        }
        
        // Clear any existing timer
        if (store.noticeTimer) {
            clearTimeout(store.noticeTimer);
            store.noticeTimer = null;
        }
    }

    /**
     * Display a notice in the UI
     */
    function displayNotice(notice) {
        const banner = document.getElementById('noticeBanner');
        const noticeText = document.getElementById('noticeText');
        
        if (!banner || !noticeText) {
            console.error("Notice banner elements not found");
            return;
        }
        
        // Set the notice text
        noticeText.textContent = notice.message;
        
        // Apply styling based on importance
        banner.className = 'notice-banner active'; // Reset classes
        if (notice.importance) {
            banner.classList.add(notice.importance);
        }
        
        // Show the banner
        banner.classList.add('active');
        
        // Clear any existing timer
        if (store.noticeTimer) {
            clearTimeout(store.noticeTimer);
        }
        
        // Set timer to hide the notice after the display time
        store.noticeTimer = setTimeout(() => {
            banner.classList.remove('active');
        }, config.noticeDisplayTime);
        
        // Store current notice
        store.currentNotice = notice;
    }

    /**
     * Get all notices for display in logs
     */
    function getAllNotices() {
        return notices;
    }

    /**
     * Add an entry to the logs
     */
    function addLogEntry(message, type = 'info') {
        const timestamp = new Date().toISOString();
        
        // Create log entry
        const logEntry = {
            timestamp,
            message,
            type
        };
        
        // Add to store
        store.logs.unshift(logEntry);
        
        // Trim logs if needed
        if (store.logs.length > config.maxLogEntries) {
            store.logs = store.logs.slice(0, config.maxLogEntries);
        }
        
        // Update UI
        updateLogsUI();
    }

    /**
     * Update the logs UI
     */
    function updateLogsUI() {
        const logsContainer = document.getElementById('logsContainer');
        if (!logsContainer) return;
        
        // Clear current logs
        logsContainer.innerHTML = '';
        
        // Add notice history to logs
        const noticeHistoryHeader = document.createElement('div');
        noticeHistoryHeader.className = 'log-section-header';
        noticeHistoryHeader.textContent = 'Notice History:';
        logsContainer.appendChild(noticeHistoryHeader);
        
        notices.forEach(notice => {
            const logElement = document.createElement('div');
            logElement.className = `log-entry log-${notice.importance}`;
            
            const timestamp = new Date(notice.timestamp);
            const formattedDate = `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`;
            
            logElement.innerHTML = `
                <span class="log-timestamp">[${formattedDate}]</span>
                <span class="log-message">${notice.message}</span>
            `;
            
            logsContainer.appendChild(logElement);
        });
        
        // Add system log header
        const systemLogHeader = document.createElement('div');
        systemLogHeader.className = 'log-section-header';
        systemLogHeader.textContent = 'System Logs:';
        logsContainer.appendChild(systemLogHeader);
        
        // Add each log entry
        store.logs.forEach(log => {
            const logElement = document.createElement('div');
            logElement.className = `log-entry log-${log.type}`;
            
            const timestamp = new Date(log.timestamp);
            const formattedTime = `${timestamp.toLocaleTimeString()}`;
            
            logElement.innerHTML = `
                <span class="log-timestamp">[${formattedTime}]</span>
                <span class="log-message">${log.message}</span>
            `;
            
            logsContainer.appendChild(logElement);
        });
    }

    /**
     * Public API
     */
    return {
        init,
        displayNotice,
        hideNotice,
        addLogEntry,
        getAllNotices
    };
})();

// Make Broadcast available globally
window.Broadcast = Broadcast;
