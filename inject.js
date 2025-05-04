(function() {
    const originalFetch = window.fetch;
    let requestCounter = 0;

    window.fetch = async function(...args) {
        const requestId = ++requestCounter; 

        let requestUrl = "";
        let requestMethod = "GET";
        let requestQuery = null;

        if (typeof args[0] === 'string') {
            requestUrl = args[0];
            if (args[1] && args[1].method) {
                requestMethod = args[1].method;
            }
            if (args[1] && args[1].body) {
                try {
                    const parsedBody = JSON.parse(args[1].body);
                    if (parsedBody.query) {
                        requestQuery = parsedBody.query;
                    }
                } catch (e) {
                }
            }
        } else if (args[0] instanceof Request) {
            const request = args[0];
            requestUrl = request.url;
            requestMethod = request.method;
        }
        const response = await originalFetch(...args);
        try {
            if (requestUrl.includes('/_api/graphql')) {
                const clonedResponse = response.clone();
                const text = await clonedResponse.text();
                let responseData = null;
                try {
                    responseData = JSON.parse(text);
                } catch (e) {
                    responseData = text;
                }
                window.postMessage({
                    type: "STAKE_FETCH_RESPONSE",
                    payload: {
                        requestId: requestId,
                        url: requestUrl,
                        method: requestMethod,
                        requestQuery: requestQuery,
                        responseData: responseData
                    }
                }, "*");
            }
        } catch (err) {
            console.error("Fetch interception error:", err);
        }
        return response;
    };
})();
