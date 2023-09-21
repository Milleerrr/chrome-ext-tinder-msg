const messageLinks = [];

function getMatches() {
    const matchProfiles = document.querySelectorAll('.matchListItem');
    for (let profile of matchProfiles) {
        const href = profile.href;
        if (href === 'https://tinder.com/app/my-likes' || href === 'https://tinder.com/app/likes-you') {
            continue;
        }
        const matchName = profile.querySelector('.Ell');
        const name = matchName.textContent;
        messageLinks.push({ name, href });
    }
    chrome.storage.local.set({ messageLinks: messageLinks });
    chrome.runtime.sendMessage({ action: "setLinks", links: messageLinks.map(l => l.href) });
    proceedWithNextLink();
}

function proceedWithNextLink() {
    chrome.runtime.sendMessage({ action: "getLink" }, function (response) {
        if (response.link) {
            window.location.href = response.link;
        }
    });
}

function sendMessage() {
    chrome.storage.local.get(['messageLinks'], function(result) {
        const links = result.messageLinks;
        const currentLink = links.find(link => link.href === window.location.href);
        
        setTimeout(() => {
            const textArea = document.querySelector('textarea[placeholder="Type a message ..."]');
            const sendButton = document.querySelector('button[draggable="false"][type="submit"]');

            if (currentLink && textArea) {
                textArea.innerHTML = currentLink.name + "!";
                textArea.dispatchEvent(new Event('input', { 'bubbles': true }));
            } else {
                console.error('Text area not found or match name not retrieved.');
            }

            setTimeout(() => {
                sendButton.click();
                console.log('Message sent to', currentLink.name);

                // Wait for 1 second (1000 milliseconds) before moving on to the next line of code
                setTimeout(() => {
                    // Inform background script that we are done with this link
                    chrome.runtime.sendMessage({ action: "finishedLink" });
                }, 1000);

            }, 2000);
        }, 5000);
    });
}


// When page loads, check if it's a message page or list page
if (window.location.href.includes("messages")) {
    sendMessage();
} else {
    getMatches();
}

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name === "tinderBot");
    port.onMessage.addListener(function (msg) {
        if (msg.action === "sendMessage") {
            if (window.location.href.includes("messages")) {
                sendMessage();
            } else {
                getMatches();
            }
        }
    });
});

// function generateTinderMessage() {
//     const prompts = [
//         "write a haiku about ",
//         "write a great pick up line for someone named ",
//         "Compose a message of love for ",
//         "Write a tinder message to ",
//         "Write an icebreaker to "
//     ];
//     return prompts[Math.floor(Math.random() * prompts.length)];
// }

// function generateIntro(prompt, name) {
//     fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', {
//         method: 'POST',
//         headers: {
//             'Authorization': 'Bearer YOUR_OPENAI_API_KEY', // Replace with your OpenAI API key
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             prompt: prompt + name,
//             temperature: 0.5,
//             max_tokens: 500
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         return data.choices[0].text.trim();
//     });
// }

