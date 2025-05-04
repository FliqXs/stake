chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('index1.html'),
  });
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    if (tab.url.includes('app=WMClaim') || tab.url.includes('app=CodeClaim')) {
      chrome.tabs.sendMessage(tabId, { type: "Bonus" }, function(response) {
        if (chrome.runtime.lastError) {}
      });
    } else if (tab.url.includes('app=Info')) {
      chrome.tabs.sendMessage(tabId, { type: "Info1" }, function(response) {
        if (chrome.runtime.lastError) {}
      });
    }
  }
});
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("checkForUpdates", { periodInMinutes: 120 });
});
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkForUpdates") {
    checkForUpdates();
  }
});
let updateUrl = "";
function checkForUpdates() {
  fetch("https://storage.googleapis.com/bcclaimer/sccupdates1.json")
    .then(response => response.json())
    .then(data => {
      const currentVersion = chrome.runtime.getManifest().version;
      const newVersion = data.version;
      if (newVersion > currentVersion) {
        chrome.runtime.sendMessage({
          type: "updateAvailable",
          url: data.update_url,
          Mversion: currentVersion,
          Nversion: newVersion,
          Critical: data.critical,
          Notes: data.update_notes,
          Features: data.features.join(", ")
        });
        updateUrl = data.update_url;
        chrome.notifications.create('updateNotification', {
          type: "basic",
          iconUrl: "https://storage.googleapis.com/bcclaimer/icon.png",
          title: "Update Available",
          message: "Click to install the new version.",
          buttons: [{ title: "Update" }]
        },
        function(notificationId) {
          if (chrome.runtime.lastError) {
            console.error('Notification error:', chrome.runtime.lastError);
          }
        });
      }
    })
    .catch(error => {
      console.error("Update check failed: ", error);
      console.error("Error details:", error.message);
    });
}
chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
  if (btnIdx === 0) {
    chrome.notifications.clear(notifId, () => {
      chrome.tabs.create({ url: updateUrl });
    });
  }
});
let sessionCookieValue = null;
function fetchStakeCookies(domain, callback) {
  chrome.cookies.getAll({ domain: domain }, (cookies) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      if (callback) callback(null);
      return;
    }
    const sessionCookie = cookies.find(cookie => cookie.name.includes('session'));
    if (sessionCookie) {
      sessionCookieValue = sessionCookie.value;
      if (callback) callback(sessionCookieValue);
    } else {
      if (callback) callback(null);
    }
  });
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GetSessionCookie') {
    fetchStakeCookies(message.domain, (value) => {
      sendResponse({ value: value });
    });
    return true;
  } else if (message.type === 'startFetchingCookies') {
    fetchStakeCookies(message.domain, () => {
      sendResponse({ status: 'started' });
    });
    return true;
  }
});
