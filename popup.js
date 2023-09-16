document.getElementById('sendMessage').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (!tabs[0]) {
            console.error('No active tab found.');
            alert('Error: No active tab found.');
            return;
        }

        let port;
        try {
            port = chrome.tabs.connect(tabs[0].id, {name: "tinderBot"});
        } catch (error) {
            console.error('Failed to connect to content script:', error);
            alert('Error: Failed to connect to content script.');
            return;
        }

        port.onDisconnect.addListener(function() {
            if (chrome.runtime.lastError) {
                console.error('Disconnected due to error:', chrome.runtime.lastError);
                alert('Error: Disconnection issue.');
            }
        });

        // Send both the action and the message in the same message
        try {
            port.postMessage({action: "sendMessage"});
        } catch (error) {
            console.error('Failed to start:', error);
            alert('Error: Failed to start.');
        }
    });
});
