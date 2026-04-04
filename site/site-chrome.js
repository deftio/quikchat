/**
 * QuikChat site chrome — shared nav and footer across all pages.
 *
 * Usage: add this to any page:
 *   <script src="[path-to]/site/site-chrome.js" data-site-root="[path-to]/site/"></script>
 *
 * The data-site-root attribute tells the script where site/ is relative to the page.
 * Examples:
 *   From site/index.html:       data-site-root="./"
 *   From site/theming.html:     data-site-root="./"
 *   From examples/foo.html:     data-site-root="../site/"
 */
(function () {
  const script = document.currentScript;
  const siteRoot = script.getAttribute('data-site-root') || './';

  // Compute paths relative to the page
  const site = siteRoot;
  const examples = siteRoot + '../examples/';
  const dist = siteRoot + '../dist/';

  // --- Nav ---
  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.innerHTML =
    '<div class="site-nav-inner">' +
      '<a class="site-logo" href="' + site + '">QuikChat</a>' +
      '<span class="site-version" id="site-version"></span>' +
      '<a href="' + site + '#demo">Demo</a>' +
      '<a href="' + site + '#install">Install</a>' +
      '<a href="' + site + 'doc.html">Docs</a>' +
      '<a href="' + examples + '">Examples</a>' +
      '<a href="' + site + 'theming.html">Theming</a>' +
      '<a href="' + site + 'downloads.html">Downloads</a>' +
      '<a href="https://github.com/deftio/quikchat">GitHub</a>' +
      '<a href="#" onclick="document.body.classList.toggle(\'site-dark\');return false" style="margin-left:auto">Light/Dark</a>' +
    '</div>';
  document.body.insertBefore(nav, document.body.firstChild);

  // --- Footer (deferred until DOM is ready so it lands at the bottom) ---
  function addFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML =
      '<div class="site-footer-inner">' +
        '<a href="https://github.com/deftio/quikchat">GitHub</a> &middot; ' +
        '<a href="https://www.npmjs.com/package/quikchat">npm</a> &middot; ' +
        'BSD-2-Clause License &middot; ' +
        '&copy; <a href="https://github.com/deftio">deftio</a>' +
      '</div>';
    document.body.appendChild(footer);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFooter);
  } else {
    addFooter();
  }

  // --- Version badge (from quikchat if loaded, or manifest) ---
  function setVersion(v) {
    const el = document.getElementById('site-version');
    if (el) el.textContent = 'v' + v;
  }

  if (typeof quikchat !== 'undefined' && quikchat.version) {
    setVersion(quikchat.version().version);
  } else {
    fetch(dist + 'build-manifest.json')
      .then(function (r) { return r.json(); })
      .then(function (m) { setVersion(m.version); })
      .catch(function () { /* no version badge */ });
  }
})();
