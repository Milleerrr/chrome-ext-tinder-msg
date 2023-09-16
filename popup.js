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

        // Get the message from the input field
        const message = document.getElementById("message").value;
        
        if (!message) {
            console.warn('No message provided.');
            alert('Please enter a message before sending.');
            return;
        }

        // Send both the action and the message in the same message
        try {
            port.postMessage({action: "sendMessage", message: message});
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Error: Failed to send message.');
        }
    });
});
