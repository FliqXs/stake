$(document).ready(function() {
    const startButton = $('#startButton');
    startButton.click(function() {
        const selectedStake = $('#stakeSelector').val();
        chrome.runtime.sendMessage({ type: 'startFetchingCookies', domain: selectedStake }, function(response) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            }
        });
        const mainUrl = `indexi.html?selectedStake=${selectedStake}`;
        const infoUrl = `https://${selectedStake}/?info`;
        setTimeout(() => {
            window.open(infoUrl, '_blank');
            window.open(mainUrl, '_blank');
            window.close();
        }, 500);
        
    });
});