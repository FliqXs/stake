document.addEventListener('DOMContentLoaded', function () {
    const updateButton = document.getElementById('updateButton');
    const updateMessage = document.getElementById('updateMessage');
    const updateContainer = document.getElementById('updateContainer');
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.type === "updateAvailable") {
            let criticalMessage = message.Critical ? 
                "<span style='color: red;'><strong>This is a CRITICAL update!</strong></span>" : 
                "<span style='color: yellow;'><strong>This is a routine update.</strong></span>";
            const Mver = message.Mversion;
            const Yver = message.Nversion;
            const notess = message.Notes;
            const featu = message.Features;
            updateMessage.innerHTML = `<span style='color: #90EE90;'>New version V${Yver}</span> released (Existing: V${Mver})!<br>${criticalMessage}<br><strong>Version Notes:</strong> ${notess}<br><strong>Features:</strong> ${featu}<br><br>🔽<strong>Click to download</strong>🔽.`;
            updateContainer.style.display = 'block';
            updateButton.onclick = function() {
                window.open(message.url, '_blank');
            };
        }
    });
});