$(document).ready(function() {
    $('#sendBonusCode').click(function() {
        const bonusCodeee = $('#bonusCodeInput').val();
        if (openextabCheckbox.is(':checked')) {
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(tab => {
                    try {
                        chrome.tabs.sendMessage(tab.id, { bonusCodeee });
                    } catch (error) {
                        console.error('Error sending message:', error);
                    }
                });
            });
        }
        const selectedStake = stakeSelector.val();
        const selectedCrypto = cryptoSelector.val();
        const urlPrefix = `https://${selectedStake}/?app=WMClaim&bonus=`;
        const urlSuffix = `${bonusCodeee}&code=${bonusCodeee}&currency=${selectedCrypto}&modal=redeemBonus`;
        let urlT = '';
        if (openUrlCheckbox.is(':checked')) {
            urlT = `${urlPrefix}${urlSuffix}`;
            window.open(urlT, '_blank');
        }
        $('#bonusCodeInput').val('');
    });
});