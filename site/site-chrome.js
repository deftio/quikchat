/**
 * QuikChat site chrome — shared nav and footer.
 *
 * Usage (add to <body> as first element):
 *   <script src="site-chrome.js"></script>              (from site/)
 *   <script src="../site/site-chrome.js"></script>      (from examples/)
 *
 * The base path is auto-computed from this script's location.
 * No data attributes needed.
 */
(function () {
  var s = document.currentScript;

  // Compute base path from this script's URL.
  // This script always lives at <base>/site/site-chrome.js,
  // so stripping "site/site-chrome.js" gives us the project root.
  var base = new URL(s.src).pathname.replace(/site\/site-chrome\.js(\?.*)?$/, '');

  // Write nav inline via document.write so it's part of the initial
  // document flow — no DOM insertion, no layout shift, no flash.
  document.write(
    '<nav class="site-nav"><div class="site-nav-inner">' +
    '<a class="site-logo" href="' + base + 'site/index.html">QuikChat<\/a>' +
    '<span class="site-version" id="site-version"><\/span>' +
    '<a href="' + base + 'site/getting-started.html">Getting Started<\/a>' +
    '<a href="' + base + 'examples/index.html">Examples<\/a>' +
    '<a href="' + base + 'site/theming.html">Theming<\/a>' +
    '<a href="' + base + 'site/downloads.html">Downloads<\/a>' +
    '<a href="' + base + 'site/doc.html">Docs<\/a>' +
    '<a href="https://github.com/deftio/quikchat">GitHub<\/a>' +
    '<button onclick="document.body.classList.toggle(\'site-dark\')" style="margin-left:auto">Light / Dark<\/button>' +
    '<\/div><\/nav>'
  );

  // Footer (appended after DOM is ready since it goes at the end)
  function addFooter() {
    var f = document.createElement('footer');
    f.className = 'site-footer';
    f.innerHTML =
      '<div class="site-footer-inner">' +
        '<a href="https://github.com/deftio/quikchat">GitHub</a> &middot; ' +
        '<a href="https://www.npmjs.com/package/quikchat">npm</a> &middot; ' +
        'BSD-2-Clause &middot; ' +
        '&copy; <a href="https://github.com/deftio">deftio</a>' +
      '</div>';
    document.body.appendChild(f);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFooter);
  } else {
    addFooter();
  }

  // Version badge
  if (typeof quikchat !== 'undefined' && quikchat.version) {
    document.getElementById('site-version').textContent = 'v' + quikchat.version().version;
  } else {
    fetch(base + 'dist/build-manifest.json')
      .then(function (r) { return r.json(); })
      .then(function (m) { document.getElementById('site-version').textContent = 'v' + m.version; })
      .catch(function () {});
  }
})();
