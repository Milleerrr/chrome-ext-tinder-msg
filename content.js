const messageLinks = [];

function getMatchProfiles() {
    return document.querySelectorAll('.matchListItem');
}

function isExcludedLink(href) {
    return href === 'https://tinder.com/app/my-likes' || href === 'https://tinder.com/app/likes-you';
}

function extractNameAndHref(profile) {
    const href = profile.href;
    const matchName = profile.querySelector('.Ell');
    const name = matchName.textContent;
    return { name, href };
}

function storeLinks() {
    chrome.storage.local.set({ messageLinks: messageLinks });
}

function sendLinksToBackground() {
    chrome.runtime.sendMessage({ action: "setLinks", links: messageLinks.map(l => l.href) });
}

function getMatches() {
    const matchProfiles = getMatchProfiles();
    for (let profile of matchProfiles) {
        if (isExcludedLink(profile.href)) continue;
        const { name, href } = extractNameAndHref(profile);
        messageLinks.push({ name, href });
    }
    storeLinks();
    sendLinksToBackground();
    proceedWithNextLink();
}

function proceedWithNextLink() {
    chrome.runtime.sendMessage({ action: "getLink" }, function (response) {
        if (response.link) {
            window.location.href = response.link;
        }
    });
}

function getCurrentLink(links) {
    return links.find(link => link.href === window.location.href);
}

function sendTextMessage(currentLink) {
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
        informBackgroundScript();
    }, 2000);
}

function informBackgroundScript() {
    setTimeout(() => {
        chrome.runtime.sendMessage({ action: "finishedLink" });
    }, 1000);
}

function sendMessage() {
    chrome.storage.local.get(['messageLinks'], function(result) {
        const currentLink = getCurrentLink(result.messageLinks);
        setTimeout(() => {
            sendTextMessage(currentLink);
        }, 5000);
    });
}

function handlePageLoad() {
    if (window.location.href.includes("messages")) {
        sendMessage();
    } else {
        getMatches();
    }
}

handlePageLoad();

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name === "tinderBot");
    port.onMessage.addListener(function (msg) {
        if (msg.action === "sendMessage") {
            handlePageLoad();
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

