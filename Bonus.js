(function() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.onload = function() {
    };
    (document.head || document.documentElement).appendChild(script);
    let attempts = 0;
    let clickCount = 0;
    const maxAttempts = 500;
    const intervalId = setInterval(() => {
        const claimButton = document.querySelector("button[type='submit']");
        //const claimCoupon = document.querySelector("button[type='submit'][data-test='claim-coupon']");
        if (claimButton) {
            if (!claimButton.disabled && getComputedStyle(claimButton).pointerEvents !== 'none') {
                clearInterval(intervalId);
                const clickInterval = setInterval(() => {
                    if (clickCount < 10) {
                        claimButton.click();
                        clickCount++;
                    } else {
                        clearInterval(clickInterval);
                    }
                }, 200);
            }
        }
        attempts++;
        if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        }
    }, 100);
    let Code = extractBonusCodeFromURL();
    let amount = null;
    function extractBonusCodeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        let codie = urlParams.get('code');
        if (codie) {
            codie = codie.replace(/[^a-zA-Z0-9]/g, '');
        }
        return codie;
    }
    window.addEventListener('message', function(event) {
        if (event.source !== window) return;
        if (event.data && event.data.type === "STAKE_FETCH_RESPONSE") {
            const { requestId, url, method, requestQuery, responseData } = event.data.payload;
            let queryName = "Response";
            if (requestQuery) {
                const match = requestQuery.match(/\bquery\s+(\w+)/);
                const matchx = requestQuery.match(/\bmutation\s+(\w+)/);
                if (match && match[1]) {
                    queryName = match[1];
                    if (queryName === "BonusCodeInformation") {
                        handleRequestReply(responseData, queryName, requestId, url, method, requestQuery);
                    } else {
                        return
                    }
                }
                if (matchx && matchx[1]) {
                    queryName = matchx[1];
                    if (queryName === "ClaimConditionBonusCode") {
                        handleRequestReply(responseData, queryName, requestId, url, method, requestQuery);
                    } else if (queryName === "ClaimBonusCode") {
                        handleRequestReply(responseData, queryName, requestId, url, method, requestQuery);
                    } else {
                        return
                    }
                }
            }
        }
    }
    , false);
    function handleRequestReply(responseData, queryName, requestId, url, method, requestQuery) {

        if (responseData && JSON.stringify(responseData).toLowerCase().includes('already')) {
            sendNotification("alreadyClaimed");
        }
        else if (responseData && responseData.data && responseData.data.bonusCodeInformation) {
            if (responseData.data.bonusCodeInformation.bonusValue !== null) {
                amount = responseData.data.bonusCodeInformation.bonusValue;
            } else {
                sendNotification(responseData.data.bonusCodeInformation.availabilityStatus);
            }
        } 
        else if (responseData && responseData.errors && responseData.errors.length > 0) {
            sendErrorNotification(responseData.errors[0].message);
        } 
        if (queryName === "ClaimConditionBonusCode" && responseData && responseData.data && responseData.data.claimConditionBonusCode.amount ) {
            message = "Drop Code Claimed Succesfully!"
            sendClaimedNotification(message);
        }
        if (queryName === "ClaimBonusCode" && responseData && responseData.data && responseData.data.claimBonusCode.redeemed && responseData.data.claimBonusCode.redeemed == true ) {
            message = "Bonus Claimed Succesfully!"
            sendClaimedNotification(message);
        }
    }    
    function sendErrorNotification(message) {
        chrome.runtime.sendMessage({
            type: "BonusNotificationFound",
            data: "Bonus Code: " + Code + " | ❌ " + message, 
            data1: Code 
        }, function(response) {
            if (chrome.runtime.lastError) {
                console.error('Mesaj gönderilirken bir hata oluştu:', chrome.runtime.lastError);
                return;
            }
        });
        const dismissButton = document.querySelector("button[type='button'][data-test='claim-bonus-dismiss']");
        if (dismissButton) {
            dismissButton.click();
        }
        setTimeout(() => {
            window.close();
        }, 1000);
    }
    function sendNotification(message) {
        if (message === "alreadyClaimed") {
            message = "☑️ You already claimed this code❗️";
        } else if (message === "weeklyWagerRequirement") {
            message = "⛔️ Your Weekly wager is not enough to claim this code❗️";
        } else if (message === "bonusCodeInactive") {
            message = "🚫 Code limit has been reached❗️";
        }
        chrome.runtime.sendMessage({ 
            type: "BonusNotificationFound", 
            data: "Bonus Code: " + Code + " | " + message, 
            data1: Code 
        }, function(response) {
            if (chrome.runtime.lastError) {
                console.error('Mesaj gönderilirken bir hata oluştu:', chrome.runtime.lastError);
                return;
            }
        });
        const dismissButton = document.querySelector("button[type='button'][data-test='claim-bonus-dismiss']");
        if (dismissButton) {
            dismissButton.click();
        }
        setTimeout(() => {
            window.close();
        }, 100);
    }
    function sendClaimedNotification(message) {
        chrome.runtime.sendMessage({ 
            type: "BonusNotificationFound", 
            data: "Bonus Code: " + Code + " | ✅ " + message + " | Bonus Value: " + amount + "$ 🔥", 
            data1: Code 
        }, function(response) {
            if (chrome.runtime.lastError) {
                console.error('Mesaj gönderilirken bir hata oluştu:', chrome.runtime.lastError);
                return;
            }
        });
        setTimeout(() => {
            const doneButton = document.querySelector("button[type='button'][data-test='claim-bonus-done']");
            if (doneButton) {
                doneButton.click();
            }
            const doneButton2 = document.querySelector("button[type='button'][data-test='claim-reward-done']");
            if (doneButton2) {
                doneButton2.click();
            }
        }, 2000);
        setTimeout(() => {
            window.close();
        }, 100);
    }
    const checkDismissInterval = setInterval(() => {
        const dismissButton = document.querySelector("button[type='button'][data-test='claim-bonus-dismiss']");
        if (dismissButton) {
            dismissButton.click();
            clearInterval(checkDismissInterval);
            setTimeout(() => {
                window.close();
            }, 1000);
        }
    }, 45000);
    setTimeout(() => {
        window.close();
    }, 120000);
})();