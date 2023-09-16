function getMatches() {
    const matchProfiles = document.querySelectorAll('.matchListItem');
    const messageLinks = [];
    for (let profile of matchProfiles) {
        const href = profile.href;
        //console.log('Extracted href:', href);  // Log the extracted href for debugging
        if (href === 'https://tinder.com/app/my-likes' || href === 'https://tinder.com/app/likes-you') {
            continue;
        }
        const matchName = profile.querySelector('.Ell');
        const name = matchName.textContent;
        messageLinks.push({ name, href });
    }
    return messageLinks;
}

function sendMessage(name, link, message, callback) {
    window.location.href = link;

    setTimeout(() => {
        const textArea = document.querySelector('/html/body/div[1]/div/div[1]/div/main/div[1]/div/div/div/div[1]/div/div/div[3]/form/textarea');
        textArea.value = message + name;
        setTimeout(() => {
            // Simulate sending the message
            textArea.click();
            console.log('Message sent')
            // Introduce another delay before processing the next link
            setTimeout(callback, 15000); // 15 seconds delay after sending the message
        }, 10000);
    }, 5000);
}

function processLinks(links, message) {
    if (links.length === 0) return; // If no more links, exit

    const { name, href } = links.shift(); // Get the first link and remove it from the list
    console.log(href);
    sendMessage(name, href, message, () => processLinks(links, message)); // Process this link and then call the function recursively for the rest
}

function sendMessageToMatches(message) {
    const links = getMatches();
    processLinks(links, message);
}

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name === "tinderBot");
    port.onMessage.addListener(function (msg) {
        if (msg.action === "sendMessage") {
            console.log("Sending message")
            sendMessageToMatches(msg.message);
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

