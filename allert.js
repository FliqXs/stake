document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['allertmesage'], function(result) {
        const alertMessageElement = document.getElementById('allertmesage');
        const headingElement = document.querySelector('h1');
        if (alertMessageElement) {
            if (result.allertmesage) {
                const username = Object.keys(result.allertmesage)[0];
                const userData = result.allertmesage[username];
                const when = userData.when;
                const message = userData.message;
                const reoson1 = userData.reson;
                alertMessageElement.style.whiteSpace = 'pre-wrap';
                alertMessageElement.style.textAlign = 'center';
                let alertMessage = '';
                let headingText = '';
                if (message === "Expired") {
                    headingText = "Your Subscription to Stake Code Claimer Has Expired";
                    alertMessage = 
                        `<span style="font-weight: bold; font-size: x-large;">Username:</span> ` +
                        `<span style="font-weight: bold; font-size: x-large; color: red;">${username}</span><br>` +
                        `<span style="font-weight: bold; font-size: x-large;">When Expired:</span> ` +
                        `<span style="font-weight: bold; font-size: x-large; color: red;">${when}</span><br><br>` +
                        `<span style="font-weight: bold; font-size: x-large;">You can extend your subscriptin by using below Telegram Bot</span><br>` +
                        `<a href="https://t.me/StakeCodeClaimerBot" style="font-weight: bold; font-size: x-large;">Stake Code Claimer Shop</a>`;
                } else if (message === "Banned") {
                    headingText = "You Have Been Banned";
                    alertMessage = 
                        `<span style="font-weight: bold; font-size: x-large; color: red;">You are banned from the server.</span><br>` +
                        `<span style="font-weight: bold; font-size: x-large;">Reason: ${reoson1}</span><br>` +
                        `<span style="font-weight: bold; font-size: x-large;">Please contact support for more information.</span>`;
                } else if (message === "NotRegistered") {
                    headingText = "You are not Registered on Stake Code Claimer Server";
                    alertMessage = 
                        `<span style="font-weight: bold; font-size: x-large; color: red;">${username}, you are not registered.</span><br>` +
                        `<span style="font-weight: bold; font-size: x-large;">Please register to continue.</span><br><br>` +
                        `<span style="font-weight: bold; font-size: x-large;">You can register by using below Telegram Bot</span><br>` +
                        `<a href="https://t.me/StakeCodeClaimerBot" style="font-weight: bold; font-size: x-large;">Stake Code Claimer Shop</a>`;
                } else if (message === "alreadyconnected") {
                    headingText = "You are already connected to Server. You can not connect to Server 2 times with same username.";
                    alertMessage = 
                        `<span style="font-weight: bold; font-size: x-large; color: red;">${username}, you are already connected.</span><br>` +
                        `<span style="font-weight: bold; font-size: x-large;">Continue using previous connection or disconnect that to continue.</span>`;
                }
                headingElement.textContent = headingText;
                alertMessageElement.innerHTML = alertMessage;

            } else {
                headingElement.textContent = "No Data Found";
                alertMessageElement.textContent = "No expiration data found.";
            }
        } else {
            console.error("Required elements not found.");
        }
    });
});