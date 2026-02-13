/**
 * AGS v3 Entry Point
 * 
 * In AGS v3:
 * - No App.config() - windows self-register when imported
 * - SCSS must be pre-compiled (not at runtime)
 * - Imports use "ags/..." paths
 */

import Gtk from "gi://Gtk?version=4.0"
import * as App from "ags/app"

import "./widgets/refreshMenu/window.js"

App.start({
    css: "./style/style.css",
})

// That's it! Windows self-register when imported.
// Add more windows by importing them:
// import "./widgets/bar/window.js";
// import "./widgets/launcher/window.js";
