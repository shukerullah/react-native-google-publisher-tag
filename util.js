function getAdUnitTargeting(adUnitTargeting) {
  if (!adUnitTargeting) {
    return "";
  }
  const unitTargeting = [];
  Object.keys(adUnitTargeting).forEach((key) => {
    let value = adUnitTargeting[key];
    // Array
    if (Array.isArray(value)) {
      value = value.map((val) => `"${val}"`);
      value = `[${value}]`;
    }
    // String
    else if (typeof value === "string") {
      value = `"${value}"`;
    }
    unitTargeting.push(`.setTargeting("${key}", ${value})`);
  });
  return unitTargeting.join("");
}

export default (
  adUnitId,
  unitSize,
  adUnitTargeting,
  background = "#f8f8f8"
) => {
  const unitTargeting = getAdUnitTargeting(adUnitTargeting);

  return `<html>
  <head>
    <meta
      name="viewport"
      content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
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
            ${unitSize},
            "div-gpt-ad-network-ads"
          )
          ${unitTargeting}
          .addService(googletag.pubads());
        googletag.pubads().enableSingleRequest();
        googletag
          .pubads()
          .addEventListener("slotOnload", function (event) {
            window.ReactNativeWebView.postMessage("slotOnload");
            setTimeout(function() {
              var body = document.getElementById('div-gpt-ad-network-ads');
              var width = Math.max(
                body.scrollWidth,
                body.offsetWidth,
              );
              var height = Math.max(
                body.scrollHeight,
                body.offsetHeight,
              );
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ width, height })
              );
            }, 0);
          })
          .addEventListener("slotRenderEnded", function (event) {
            if (event && event.isEmpty) {
              window.ReactNativeWebView.postMessage("false");
            }
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
