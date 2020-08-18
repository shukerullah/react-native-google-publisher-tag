export default (
  adUnitId,
  adUnitSize,
  adUnitTargeting,
  background = "#f8f8f8"
) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <script
        async="async"
        src="https://www.googletagservices.com/tag/js/gpt.js"
      ></script>
      <script>
        var googletag = googletag || {};
        googletag.cmd = googletag.cmd || [];
      </script>
      <script>
        googletag.cmd.push(function () {
          googletag
            .defineSlot(
              "${adUnitId}",
              ${adUnitSize},
              "div-gpt-ad-network-ads"
            )
            ${adUnitTargeting}
            .addService(googletag.pubads());
          googletag.pubads().enableSingleRequest();
          googletag
            .pubads()
            .addEventListener("impressionViewable", function (event) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ impressionViewable: event })
              );
            })
            .addEventListener("slotOnload", function (event) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ slotOnload: event })
              );
              setTimeout(function () {
                var body = document.getElementById("div-gpt-ad-network-ads");
                var width = Math.max(body.scrollWidth, body.offsetWidth);
                var height = Math.max(body.scrollHeight, body.offsetHeight);
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({ width, height })
                );
              }, 0);
            })
            .addEventListener("slotRenderEnded", function (event) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ slotRenderEnded: event })
              );
            })
            .addEventListener("slotRequested", function (event) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ slotRequested: event })
              );
            })
            .addEventListener("slotResponseReceived", function (event) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ slotResponseReceived: event })
              );
            })
            .addEventListener("slotVisibilityChanged", function (event) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ slotVisibilityChanged: event })
              );
            });
          googletag.pubads().collapseEmptyDivs();
          googletag.enableServices();
        });
      </script>
      <style>
        html,
        body {
          height: 100%;
        }
        html {
          display: table;
          width: 100%;
        }
        body {
          display: table-cell;
          text-align: center;
          vertical-align: middle;
          background: ${background};
        }
      </style>
    </head>
    <body>
      <div id="div-gpt-ad-network-ads">
        <script>
          googletag.cmd.push(function () {
            googletag.display("div-gpt-ad-network-ads");
          });
        </script>
      </div>
    </body>
  </html>`;
};
