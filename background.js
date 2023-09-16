// Establishes connectio to Tinder 
const TINDER_ORIGIN = 'https://tinder.com';

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;
    const url = new URL(tab.url);
    const sidePanelOptions = { tabId, path: 'popup.html', enabled: url.origin === TINDER_ORIGIN };
    await chrome.sidePanel.setOptions(sidePanelOptions);
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

// Send messages when after navigating to mathces
let links = [];
let currentLinkIndex = 0;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getLink") {
        sendResponse({ link: links[currentLinkIndex] });
    } else if (request.action === "finishedLink") {
        currentLinkIndex++;
        if (currentLinkIndex < links.length) {
            chrome.tabs.update(sender.tab.id, { url: links[currentLinkIndex] });
        }
    } else if (request.action === "setLinks") {
        links = request.links;
        currentLinkIndex = 0;
    }
});
