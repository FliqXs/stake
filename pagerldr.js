(function() {
  let currentDomain1 = window.location.hostname;
  function refreshPage(currentDomain1) {
      setInterval(function() {
          window.location.replace(`https://${currentDomain1}/settings/offers?app=Bonus`);
      }, 1200000);
  }

  refreshPage(currentDomain1);
})();
