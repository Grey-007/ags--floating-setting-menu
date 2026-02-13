import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"

import { RefreshApps } from "./sections/refreshApps.js"
import { PositionControls } from "./sections/layoutPosition.js"
import { ComingSoon } from "./sections/comingSoon.js"
import { closeMenu, menuOpen } from "./controller/menuState.js"
import {
    modulePosition,
    getMenuPlacement,
    getPositionClass,
    type Placement,
} from "./controller/layout.js"

function setClasses(widget: Gtk.Widget, classes: string[]) {
    widget.set_css_classes(classes)
}

function applyPlacement(window: Astal.Window, placement: Placement) {
    window.anchor = placement.anchor
    window.marginTop = placement.marginTop
    window.marginRight = placement.marginRight
    window.marginBottom = placement.marginBottom
    window.marginLeft = placement.marginLeft
}

function DrawerPanel() {
    const panel = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 12,
    })
    setClasses(panel, ["refresh-drawer-panel"])

    panel.append(RefreshApps())
    panel.append(PositionControls())
    panel.append(ComingSoon("Automation"))

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

    window.connect("notify::is-active", () => {
        if (!window.is_active && menuOpen.get()) {
            closeMenu()
        }
    })

    try {
        window.connect("focus-out-event", () => {
            closeMenu()
            return false
        })
    } catch {
        // Gtk4 backend may not expose this signal on all setups.
    }
}

const drawerRevealer = new Gtk.Revealer({
    transition_type: Gtk.RevealerTransitionType.CROSSFADE,
    transition_duration: 1,
    reveal_child: false,
    child: RefreshMenuContent(),
})

const RefreshMenu = new Astal.Window({
    name: "refresh-menu",
    visible: false,
    child: drawerRevealer,
})
setClasses(RefreshMenu, ["refresh-menu-window", "is-closed", "position-bottom"])
RefreshMenu.layer = Astal.Layer.OVERLAY
RefreshMenu.exclusivity = Astal.Exclusivity.NORMAL
RefreshMenu.keymode = Astal.Keymode.ON_DEMAND

setupInputHandlers(RefreshMenu)

modulePosition.subscribe((position) => {
    const placement = getMenuPlacement(position)
    applyPlacement(RefreshMenu, placement)

    const openClass = menuOpen.get() ? "is-open" : "is-closed"
    setClasses(RefreshMenu, ["refresh-menu-window", openClass, getPositionClass(position)])
})

menuOpen.subscribe((open) => {
    const positionClass = getPositionClass(modulePosition.get())

    if (open) {
        RefreshMenu.visible = true
        setClasses(RefreshMenu, ["refresh-menu-window", "is-open", positionClass])
        drawerRevealer.set_reveal_child(true)
        RefreshMenu.present()
        return
    }

    setClasses(RefreshMenu, ["refresh-menu-window", "is-closed", positionClass])
    drawerRevealer.set_reveal_child(false)
})

drawerRevealer.connect("notify::child-revealed", () => {
    if (!menuOpen.get() && !drawerRevealer.get_child_revealed()) {
        RefreshMenu.visible = false
    }
})

let registered = false
app.connect("startup", () => {
    if (registered) return
    app.add_window(RefreshMenu)
    registered = true
})
