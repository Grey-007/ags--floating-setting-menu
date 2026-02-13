/**
 * Refresh Menu Window - AGS v3
 * 
 * Windows self-register in AGS v3 - no manual mounting needed
 */

import { App, Widget, Variable } from "ags";
import { RefreshApps } from "./sections/refreshApps.js";
import { ComingSoon } from "./sections/comingSoon.js";

// Global state for menu visibility
const isMenuOpen = Variable(false);

/**
 * Handle Component - The floating circular button
 */
function Handle({ onClicked }: { onClicked: () => void }) {
    return Widget.Button({
        class_name: "refresh-handle",
        on_clicked: onClicked,
        child: Widget.Box({
            class_name: "refresh-handle-inner",
            child: Widget.Label({
                label: "󰑓",
                class_name: "refresh-handle-icon",
            }),
        }),
    });
}

/**
 * Drawer Panel - The main content that slides up/down
 */
function DrawerPanel() {
    return Widget.Revealer({
        reveal_child: isMenuOpen.bind(),
        transition: "slide_up",
        transition_duration: 250,
        child: Widget.Box({
            class_name: "refresh-drawer-panel",
            vertical: true,
            children: [
                RefreshApps(),
                ComingSoon(2),
                ComingSoon(3),
                ComingSoon(4),
            ],
        }),
    });
}

/**
 * Main container with handle and drawer
 */
function RefreshMenuContent() {
    return Widget.Box({
        class_name: "refresh-menu-container",
        vertical: true,
        children: [
            DrawerPanel(),
            Handle({
                onClicked: () => {
                    isMenuOpen.value = !isMenuOpen.value;
                },
            }),
        ],
    });
}

/**
 * Refresh Menu Window
 * 
 * In AGS v3, windows self-register when created
 * No need to return or export for App.config()
 */
const RefreshMenu = Widget.Window({
    name: "refresh-menu",
    class_name: "refresh-menu-window",
    anchor: ["bottom", "right"],
    layer: "overlay",
    exclusivity: "normal",
    keymode: "none",
    visible: true,
    child: RefreshMenuContent(),
});

// Export for potential external control
export { isMenuOpen };
