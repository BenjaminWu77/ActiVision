chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ screenTime: 0 });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    if (['youtube.com', 'tiktok.com', 'reddit.com', 'twitter.com'].includes(url.hostname)) {
      chrome.storage.sync.get('screenTime', (data) => {
        console.log(`Current screen time: ${data.screenTime}`);
        if (data.screenTime > 0) {
          chrome.storage.sync.set({ screenTime: data.screenTime - 1 });
          fetch('http://localhost:5001/api/screen-time', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ minutes: 1 }),
          }).then(() => {
            console.log('Screen time decremented');
          }).catch((error) => {
            console.error('Error decrementing screen time:', error);
          });
        } else {
          console.log('Blocking access to:', url.hostname);
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
              window.location.href = chrome.runtime.getURL('blocked.html');
            }
          });
        }
      });
    }
  }
});