let processedCodes = new Set();
let claimedCodes = new Set();
let lastMessage = null;
let lastMessageTimestamp = 0;
let attemptsPerCode = {};
let pendingAlreadyMessages = {};
const codeclaimnotification = $('#codeclaimnotification');
const reloadnotifications = $('#reloadnotifications');
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === "NotificationFound" || message.type === "BonusNotificationFound" || message.type === "WarningFound") {
        sendResponse("Received");
        const currentTime = new Date().getTime();
        const timestamp = new Date().toLocaleString();
        const messageCodeMatch = message.data1;
        const msgDataLower = message.data.toLowerCase();
        if (messageCodeMatch && claimedCodes.has(messageCodeMatch)) {
            return;
        }
        if (messageCodeMatch) {
            if (processedCodes.has(messageCodeMatch)) {
            } else {
                processedCodes.add(messageCodeMatch);
            }
        }
        if (msgDataLower.includes("captcha")) {
            if (!attemptsPerCode[messageCodeMatch]) {
                attemptsPerCode[messageCodeMatch] = 1;
                claimthecode2(messageCodeMatch);
                NotificationMessages("❗️Captcha error, trying again!");
            } else if (attemptsPerCode[messageCodeMatch] === 1) {
                attemptsPerCode[messageCodeMatch] = 2;
                NotificationMessages("❗️Captcha error, tried 1 more time but didn't work!");
            } else {
                NotificationMessages("❗️Captcha error, no more tries left!");
            }
            return;
        }
        if (msgDataLower.includes("already")) {
            if (!claimedCodes.has(messageCodeMatch)) {
                if (!pendingAlreadyMessages[messageCodeMatch]) {
                    const storedMessage = message.data; 
                    const timeoutId = setTimeout(() => {
                        if (!claimedCodes.has(messageCodeMatch)) {
                            NotificationMessages("📣 " + storedMessage);
                        } 
                        delete pendingAlreadyMessages[messageCodeMatch];
                    }, 3000);
                    pendingAlreadyMessages[messageCodeMatch] = { timeoutId: timeoutId, messageData: storedMessage };
                }
            }
            return;
        }
        if (msgDataLower.includes("error") && !msgDataLower.includes("captcha") && !msgDataLower.includes("already")) {
            NotificationMessages("📣 " + message.data);
            return;
        }
        const isClaimed = msgDataLower.includes("claimed succesfully");
        if (isClaimed && messageCodeMatch) {
            if (pendingAlreadyMessages[messageCodeMatch]) {
                clearTimeout(pendingAlreadyMessages[messageCodeMatch].timeoutId);
                delete pendingAlreadyMessages[messageCodeMatch];
            }
            claimedCodes.add(messageCodeMatch);
            NotificationMessages(`📣 ` + message.data);
            if (codeclaimnotification.is(':checked')) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'edd.png',
                    title: 'Bonus Notification',
                    message: message.data,
                    priority: 2
                });
            }
            lastMessage = message.data;
            lastMessageTimestamp = currentTime;
            return;
        }
        if (message.type === "NotificationFound") {
            let msgContent = "";
            if (message.data == "❗️ No Active Reload Found!") {
                const msgContentx = `Reload: ${message.data}`;
                NotificationMessages(msgContentx);
                $('#reload').prop('checked', false);
                $('#reloadtovault').prop('checked', false);
                return;
            }
            else if (message.data == "❗️ Last Reload Claimed and Reload expired!") {
                const msgContentx = `Reload: ${message.data}`;
                NotificationMessages(msgContentx);
                $('#reload').prop('checked', false);
                $('#reloadtovault').prop('checked', false);
                return;
            }
            msgContent = `  ${timestamp} \n💃Reload: ${message.data} \n`;
            ReloadNotificationMessages(msgContent);
            if (reloadnotifications.is(':checked')) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'edd.png',
                    title: 'Reload Notification',
                    message: msgContent,
                    priority: 2
                });
            }
        } else if (message.type === "BonusNotificationFound") {
            NotificationMessages(`📣 ` + message.data);
            if (codeclaimnotification.is(':checked')) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'edd.png',
                    title: 'Bonus Notification',
                    message: message.data,
                    priority: 2
                });
            }
            const codeRegex = /Bonus Code:\s*([^\s]+)/i;
            const match = message.data.match(codeRegex);
            if (match) {
                const bonusCode = match[1];
                if (msgDataLower.includes("Succesfully")) {
                    const bonusPre = $('#bonusMessages pre').filter(function() {
                        return $(this).text().includes(bonusCode);
                    });
                    if (bonusPre.length > 0) {
                        let originalText = bonusPre.text();
                        if (!originalText.includes('✅')) {
                            bonusPre.text(originalText + ' ✅');
                        }
                    }
                } else {
                    const bonusPre = $('#bonusMessages pre').filter(function() {
                        return $(this).text().includes(bonusCode);
                    });
                    if (bonusPre.length > 0) {
                        let originalText = bonusPre.text();
                        if (!originalText.includes('❌')) {
                            bonusPre.text(originalText + ' ❌');
                        }
                    }
                }
            }
        } else if (message.type === "WarningFound") {
            NotificationMessages(`❗️ Warning: ` + message.data);
        }
        lastMessage = message.data;
        lastMessageTimestamp = currentTime;
    }
});
const NotificationMessages = function (Notifications) {
    const notMsg = $('<pre>').text(`[${getNowDateStr2()}] ${Notifications}`);
    $('#NotificationMessages').prepend(notMsg);
    const notMsgBox = document.getElementById('NotificationMessages');
    notMsgBox.scrollTop = notMsgBox.scrollHeight;
};
const ReloadNotificationMessages = function (msgContent) {
    const msgBox = $('#reloadMessages');
    if (msgBox.children('pre.reload-codex').length === 0) {
        const bonusMsg = $('<pre>').addClass('reload-codex').text(`Reloads\n`);
        msgBox.prepend(bonusMsg);
    }
    const msg = $('<pre>').text(msgContent);
    msgBox.children('pre.reload-codex').after(msg);
    const domMsgBox = document.getElementById('reloadMessages');
    domMsgBox.scrollTop = domMsgBox.scrollHeight;
};
const claimthecode2 = function (messageCodeMatch) {
    const selectedStake = stakeSelector.val();
    const selectedCrypto = cryptoSelector.val();
    const urlPrefix = `https://${selectedStake}/settings/offers?app=CodeClaim&type=drop&code=`;
    const urlSuffix = `&currency=${selectedCrypto}&modal=redeemBonus`;
    let urlB = `${urlPrefix}${messageCodeMatch}${urlSuffix}`;
    window.open(urlB, '_blank');
};
function getNowDateStr2() {
    return new Date().toLocaleString();
}
