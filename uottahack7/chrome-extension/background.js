chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ screenTime: 0 });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    if (['youtube.com', 'tiktok.com', 'reddit.com', 'twitter.com'].includes(url.hostname)) {
      chrome.storage.sync.get('screenTime', (data) => {
        if (data.screenTime > 0) {
          chrome.storage.sync.set({ screenTime: data.screenTime - 1 });
          fetch('http://localhost:5001/api/screen-time', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ minutes: 1 }),
          });
        } else {
          chrome.tabs.update(tabId, { url: 'about:blank' });
        }
      });
    }
  }
});