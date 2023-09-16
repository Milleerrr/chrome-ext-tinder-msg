const TINDER_ORIGIN = 'https://tinder.com';

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;
    const url = new URL(tab.url);
    const sidePanelOptions = { tabId, path: 'popup.html', enabled: url.origin === TINDER_ORIGIN };
    await chrome.sidePanel.setOptions(sidePanelOptions);
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));


