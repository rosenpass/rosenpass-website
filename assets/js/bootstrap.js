// Bootstrap JS bundle entry point.
//
// Bootstrap is bundled from the npm-installed package (see package.json;
// node_modules/bootstrap is mounted at assets/vendor/bootstrap in
// config.toml). This replaces the former vendored and patched
// assets/js/bootstrap.bundle.js.
//
// Some scripts on this site (e.g. click-to-copy.js, dark-mode.js,
// offline-search.js) expect a global `bootstrap` object, so all Bootstrap
// plugins are re-exported on `window.bootstrap`. The mobile navbar component
// is bundled here as well, since it builds on Bootstrap's internals.

import * as bootstrap from 'bootstrap'
import './mobile-navbar.js'

window.bootstrap = bootstrap
