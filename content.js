function getMatches() {
    const matchProfiles = document.querySelectorAll('.matchListItem');
    const messageLinks = [];
    for (let profile of matchProfiles) {
        const href = profile.href;
        if (href === 'https://tinder.com/app/my-likes' || href === 'https://tinder.com/app/likes-you') {
            continue;
        }
        const matchName = profile.querySelector('.Ell');
        const name = matchName.textContent;
        messageLinks.push({ name, href });
    }
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
    setTimeout(() => {
        const textArea = document.querySelector('#c1558494470');
        const sendButton = document.querySelector('button[draggable="false"][type="submit"]');

        // Assuming "message" variable is globally available; adjust as needed
        if (textArea) {
            textArea.innerHTML = 'Hi';
            textArea.dispatchEvent(new Event('input', { 'bubbles': true }));
        } else {
            console.error('Text area not found');
        }


        setTimeout(() => {
            // Simulate sending the message
            sendButton.click();
            console.log('Message sent');

            // Inform background script that we are done with this link
            chrome.runtime.sendMessage({ action: "finishedLink" });

        }, 10000);
    }, 5000);
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
            // Assuming "message" is set here globally; adjust as needed
            message = msg.message;
            console.log("Sending message");

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

