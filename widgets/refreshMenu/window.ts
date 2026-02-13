import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"

import { RefreshApps } from "./sections/refreshApps.js"
import { ComingSoon } from "./sections/comingSoon.js"

let open = false

function setClasses(widget: Gtk.Widget, classes: string[]) {
    widget.set_css_classes(classes)
}

function setMenuOpen(
    state: boolean,
    drawer: Gtk.Revealer,
    handleIcon: Gtk.Label,
) {
    open = state
    drawer.set_reveal_child(state)
    handleIcon.set_label(state ? "󰑕" : "󰑓")
}

function Handle(onClicked: () => void) {
    const icon = new Gtk.Label({ label: "󰑓" })
    setClasses(icon, ["refresh-handle-icon"])

    const inner = new Gtk.Box()
    setClasses(inner, ["refresh-handle-inner"])
    inner.append(icon)

    const button = new Gtk.Button()
    setClasses(button, ["refresh-handle"])
    button.set_child(inner)
    button.connect("clicked", onClicked)

    return { button, icon }
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

    const revealer = new Gtk.Revealer({
        transition_type: Gtk.RevealerTransitionType.SLIDE_UP,
        transition_duration: 250,
    })
    revealer.set_child(panel)
    revealer.set_reveal_child(false)

    return revealer
}

function RefreshMenuContent() {
    const container = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 12,
    })
    setClasses(container, ["refresh-menu-container"])

    const drawer = DrawerPanel()
    const { button, icon } = Handle(() => {
        setMenuOpen(!open, drawer, icon)
    })

    container.append(drawer)
    container.append(button)

    return container
}

const RefreshMenu = new Astal.Window({
    name: "refresh-menu",
    visible: true,
    child: RefreshMenuContent(),
})
setClasses(RefreshMenu, ["refresh-menu-window"])
RefreshMenu.anchor = Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT
RefreshMenu.layer = Astal.Layer.OVERLAY
RefreshMenu.exclusivity = Astal.Exclusivity.NORMAL
RefreshMenu.keymode = Astal.Keymode.NONE

let registered = false
app.connect("startup", () => {
    if (registered) return
    app.add_window(RefreshMenu)
    registered = true
})
