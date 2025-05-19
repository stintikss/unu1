chrome.runtime.onInstalled.addListener(() => {
    // Initialize filter storage
    chrome.storage.local.set({ filter24Hours: false });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getFilter') {
        chrome.storage.local.get(['filter24Hours'], (data) => {
            sendResponse({ filter24Hours: data.filter24Hours });
        });
        return true; // Keep the message channel open for the async response
    }
});
