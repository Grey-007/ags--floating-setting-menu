import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"

import { menuState, toggleMenu } from "../refreshMenu/controller/menuState.js"

function setClasses(widget: Gtk.Widget, classes: string[]) {
    widget.set_css_classes(classes)
}

function setFabVisualState(button: Gtk.Button, icon: Gtk.Label, isOpen: boolean) {
    setClasses(button, ["fab-button", isOpen ? "is-open" : "is-closed"])
    setClasses(icon, ["fab-icon", isOpen ? "is-open" : "is-closed"])
    icon.label = isOpen ? "󰅖" : "󰒓"
}

function FabButton() {
    const icon = new Gtk.Label({ label: "󰒓" })
    setClasses(icon, ["fab-icon", "is-closed"])

    const button = new Gtk.Button({ child: icon })
    setClasses(button, ["fab-button", "is-closed"])
    button.connect("clicked", () => {
        toggleMenu()
    })

    menuState.subscribe((isOpen) => {
        setFabVisualState(button, icon, isOpen)
    })

    return button
}

const FabWindow = new Astal.Window({
    name: "fab",
    visible: true,
    child: FabButton(),
})
setClasses(FabWindow, ["fab-window"])
FabWindow.anchor = Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT
FabWindow.layer = Astal.Layer.OVERLAY
FabWindow.exclusivity = Astal.Exclusivity.IGNORE
FabWindow.keymode = Astal.Keymode.NONE
FabWindow.marginBottom = 24
FabWindow.marginRight = 24
FabWindow.marginTop = 0
FabWindow.marginLeft = 0

let registered = false
app.connect("startup", () => {
    if (registered) return
    app.add_window(FabWindow)
    registered = true
})
