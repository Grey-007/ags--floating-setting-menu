import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"

import { RefreshApps } from "./sections/refreshApps.js"
import { ComingSoon } from "./sections/comingSoon.js"
import { closeMenu, menuState } from "./controller/menuState.js"

function setClasses(widget: Gtk.Widget, classes: string[]) {
    widget.set_css_classes(classes)
}

function DrawerPanel() {
    const panel = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 12,
    })
    setClasses(panel, ["refresh-drawer-panel"])

    panel.append(RefreshApps())
    panel.append(ComingSoon(2))
    panel.append(ComingSoon(3))
    panel.append(ComingSoon(4))

    return panel
}

function RefreshMenuContent() {
    const container = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
    })
    setClasses(container, ["refresh-menu-container"])
    container.append(DrawerPanel())
    return container
}

function setupInputHandlers(window: Astal.Window) {
    const keyController = new Gtk.EventControllerKey()
    keyController.connect("key-pressed", (_, keyval) => {
        if (keyval === Gdk.KEY_Escape) {
            closeMenu()
            return true
        }
        return false
    })
    window.add_controller(keyController)

    try {
        window.connect("focus-out-event", () => {
            closeMenu()
            return false
        })
    } catch {
        // Gtk4 fallback: close when window deactivates.
        window.connect("notify::is-active", () => {
            if (!window.is_active) {
                closeMenu()
            }
        })
    }
}

const drawerRevealer = new Gtk.Revealer({
    transition_type: Gtk.RevealerTransitionType.SLIDE_UP,
    transition_duration: 150,
    reveal_child: false,
    child: RefreshMenuContent(),
})

const RefreshMenu = new Astal.Window({
    name: "refresh-menu",
    visible: false,
    child: drawerRevealer,
})
setClasses(RefreshMenu, ["refresh-menu-window", "is-closed"])
RefreshMenu.anchor = Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT
RefreshMenu.layer = Astal.Layer.OVERLAY
RefreshMenu.exclusivity = Astal.Exclusivity.NORMAL
RefreshMenu.keymode = Astal.Keymode.ON_DEMAND

setupInputHandlers(RefreshMenu)

menuState.subscribe((open) => {
    if (open) {
        RefreshMenu.visible = true
        setClasses(RefreshMenu, ["refresh-menu-window", "is-open"])
        drawerRevealer.set_reveal_child(true)
        RefreshMenu.present()
        return
    }

    setClasses(RefreshMenu, ["refresh-menu-window", "is-closed"])
    drawerRevealer.set_reveal_child(false)
})

drawerRevealer.connect("notify::child-revealed", () => {
    if (!drawerRevealer.get_reveal_child() && !drawerRevealer.get_child_revealed()) {
        RefreshMenu.visible = false
    }
})

let registered = false
app.connect("startup", () => {
    if (registered) return
    app.add_window(RefreshMenu)
    registered = true
})
