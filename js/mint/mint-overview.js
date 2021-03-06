// Wait a few seconds to start the sync, otherwise it will start before the login happens.
setTimeout(function() {
    chrome.runtime.sendMessage({"triggerEvent": "mint-opened"});
    if (window.location.href.indexOf("forceRobinhoodSync=true") !== -1) {
        doAlert({"status": "Syncing Mint with Robinhood.", "persistant": true});
        chrome.runtime.sendMessage({"triggerEvent": "forceSync"});
    }
}, 2000);

function doAlert(request) {
    var notificationSettings = {
	    title: 'Robinhood Mint Sync for Chrome',
        subtitle: request.status,
        btn1Text: 'Close',
        btn1Link: null,
        imageSrc: chrome.extension.getURL("/images/icon128.png"),
        imageLink: null,
        btn2Text: null,
        mainLink: null
    };
    if (typeof(request.link) !== "undefined") {
        notificationSettings.btn2Text = request.linkText;
        notificationSettings.btn2Link = request.link;
    }
    if (typeof(request.newTab !== "undefined")) {
        notificationSettings.btn2NewTab = request.newTab;
    }
    if (!(request.persistant)) {
        notificationSettings.autoDismiss = 15;
    }

    macOSNotif(notificationSettings);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (window.location.href.indexOf("forceRobinhoodSync=true") !== -1) {
        if (request.status == "Sync performed in the last hour. Not syncing.") {
            return;
        }
        if (request.shouldReload == true) {
            location.reload();
        }
    }
    doAlert(request);

    console.log(request.status);
});
