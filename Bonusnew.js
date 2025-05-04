(function() {
    const currentDomain = window.location.hostname;
    let Code = "";
    let amount = null;
    chrome.runtime.sendMessage({ type: 'getCurrencyInfo' }, (response) => {
        if (response && response.currencyCode) {
            const currencyCode = response.currencyCode;
            setTimeout(() => {
                const button1 = document.querySelector('[data-test="coin-toggle"]');
                if (button1) {
                    const activeCurrency = button1.getAttribute('data-active-currency');
                    if (activeCurrency && activeCurrency !== currencyCode) {
                        button1.click();
                        setTimeout(() => {
                            const qselector = `[data-test="coin-toggle-currency-${currencyCode}"]`;
                            const button2 = document.querySelector(qselector);
                            if (button2) {
                                button2.click();
                            }
                        }, 200);
                    }
                }
            }, 1000);
        }
        if (chrome.runtime.lastError) {
        }
    });
    function injectBonusCode(code) {
        const inputField = document.querySelector('input[name="code"]:not([disabled])');
        const submitButtons = document.querySelectorAll("button[type='submit'][data-test='password-reset-button']");
        const submitButton = submitButtons[1];

        if (!inputField || !submitButton) {
            console.error("🔴 Input field or submit button not found.");
            return;
        }
        inputField.value = code;
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        submitButton.removeAttribute("disabled");
        submitButton.click();
        let attempts = 0;
        let clickCount = 0;
        const maxAttempts = 500;
        const intervalId = setInterval(() => {
            const claimButton = document.querySelector("button[type='submit'][data-test='claim-drop']");
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
    }
    function handleMessage(message, sender, sendResponse) {
        if (message.bonusCodeee) {
            const code = message.bonusCodeee;
            Code = message.bonusCodeee;
            injectBonusCode(code);
            sendResponse({ received: true });
        }
    }
    chrome.runtime.onMessage.addListener(handleMessage);
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
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
        const claimButton = document.querySelector("button[type='submit'][data-test='claim-drop']");
        if (claimButton) {
            claimButton.click();
        }

        if (queryName === "ClaimConditionBonusCode" && responseData && responseData.data && responseData.data.claimConditionBonusCode.amount ) {
            message = "Drop Code Claimed Succesfully!"
            sendClaimedNotification(message);
        }
        else if (queryName === "ClaimBonusCode" && responseData && responseData.data && responseData.data.claimBonusCode.redeemed && responseData.data.claimBonusCode.redeemed == true ) {
            message = "Bonus Claimed Succesfully!"
            sendClaimedNotification(message);
        }

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
        const dismissButton2 = document.querySelector("button[type='button'][data-test='claim-drop-dismiss']");
        if (dismissButton2) {
            dismissButton2.click();
        }
        setTimeout(() => {
            window.close();
        }, 100);
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
        const dismissButton2 = document.querySelector("button[type='button'][data-test='claim-drop-dismiss']");
        if (dismissButton2) {
            dismissButton2.click();
        }
        setTimeout(() => {
            window.close();
        }, 500);
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
            const doneButton = document.querySelector("button[type='button'][data-test='claim-reward-done']");
            if (doneButton) {
                doneButton.click();
            }
        }, 2000);
        setTimeout(() => {
            window.close();
        }, 1000);
    }
    const checkDismissInterval = setInterval(() => {
        const dismissButton = document.querySelector("button[type='button'][data-test='claim-bonus-dismiss']");
        if (dismissButton) {
            dismissButton.click();
            clearInterval(checkDismissInterval);
        }
    }, 45000);
})();
