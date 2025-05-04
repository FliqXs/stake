const rankSpan = $('#112');
const rankPSpan = $('#122');
const vipProgressSpan = $('#113');
const ReloadSpan = $('#115');
const ReloadamountSpan = $('#195');
const Onusercount = $('#116');
const Reloadyokspan = $('#xax');
const usernameSpan = $('#111');
const openextabCheckbox = $('#openextabCheckbox');
$(document).ready(function() {
    $('input[type="checkbox"]').change(function() {
        var label = $('label[for="' + $(this).attr('id') + '"]');
        if ($(this).is(':checked')) {
            label.css('color', '');
        } else {
            label.css('color', 'red');
        }
    });
});
$(document).ready(function() {
    $('input[id="reload"]').change(function() {
        var label = $('label[for="reload"]');
        if ($(this).is(':checked')) {
            label.css('color', 'rgb(17, 255, 0)');
        } else {
            label.css('color', ''); 
        }
    });
});
$(document).ready(function() {
    $('#buyorex').click(function() {
        const buyurl = `https://t.me/StakeCodeClaimerBot`;
        window.open(buyurl, '_blank');
    });
});
function checkIfUrlIsOpen() {
    if (openextabCheckbox.is(':checked')) {
        const selectedStake = stakeSelector.val();
        const desiredUrlPattern = /settings\/offers\?app=Bonus/;
        chrome.tabs.query({}, function(tabs) {
            let isUrlOpen = false;
            for (const tab of tabs) {
                if (tab.url && desiredUrlPattern.test(tab.url)) {
                    isUrlOpen = true;
                    break;
                }
            }
            if (!isUrlOpen) {
                const urrll = `https://${selectedStake}/settings/offers?app=Bonus`;
                window.open(urrll, '_blank');
            }
        });
    }
}
function isUrlOpen(url) {
    return new Promise(resolve => {
        chrome.tabs.query({ url: url }, function(tabs) {
            resolve(tabs.length > 0);
        });
    });
}
setInterval(checkIfUrlIsOpen, 30000);

document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.getElementById('toggleBackgroundCheckbox');
    const checkbox1 = document.getElementById('openextabCheckbox');
    const middleDiv = document.querySelector('.middle');
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            middleDiv.style.backgroundImage = "url('/resources/edd.png')";
        } else {
            middleDiv.style.backgroundImage = "none";
        }
    });
    checkbox1.addEventListener('change', function() {
        if (checkbox1.checked) {
            const selectedStake = stakeSelector.val();
            const urrll = `https://${selectedStake}/settings/offers?app=Bonus`;
            window.open(urrll, '_blank');
        } else {
            return;
        }
    });
    checkbox.checked = false;
});
$(document).ready(function () {
    const getUrlParameter = function (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
    const selectedStake = getUrlParameter('selectedStake');
    if (selectedStake) {
        $('#stakeSelector').val(selectedStake);
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const versionInfo = document.getElementById("versionInfo");
    if (versionInfo) {
        const manifest = chrome.runtime.getManifest();
        versionInfo.textContent = `Version: ${manifest.version}`;
    }
});