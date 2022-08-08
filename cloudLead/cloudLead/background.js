chrome.runtime.onInstalled.addListener(function() {
    console.log("HI");
    chrome.tabs.onActivated.addListener(async info => {
      const tab = await chrome.tabs.get(info.tabId);
      console.log(tab);
      const isGithub = tab.url.startsWith('https://linkedin.com/');
      console.log(isGithub);
      isGithub 
        ? chrome.action.enable(tab.tabId) 
        : chrome.action.disable(tab.tabId);
    });
  });