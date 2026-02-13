import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"

import { menuOpen, toggleMenu } from "../refreshMenu/controller/menuState.js"
import {
    modulePosition,
    getFabPlacement,
    getPositionClass,
    type Placement,
} from "../refreshMenu/controller/layout.js"

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

function setFabVisualState(
    button: Gtk.Button,
    icon: Gtk.Label,
    isOpen: boolean,
    positionClass: string,
) {
    setClasses(button, ["fab-button", isOpen ? "is-open" : "is-closed", positionClass])
    setClasses(icon, ["fab-icon", isOpen ? "is-open" : "is-closed"])
    icon.label = isOpen ? "󰅖" : "󰒓"
}

function FabButton() {
    const icon = new Gtk.Label({ label: "󰒓" })
    setClasses(icon, ["fab-icon", "is-closed"])

    const button = new Gtk.Button({ child: icon })
    setClasses(button, ["fab-button", "is-closed", "position-bottom"])
    button.connect("clicked", () => {
        toggleMenu()
    })

    const updateVisuals = () => {
        const open = menuOpen.get()
        const positionClass = getPositionClass(modulePosition.get())
        setFabVisualState(button, icon, open, positionClass)
    }

    menuOpen.subscribe(() => updateVisuals())
    modulePosition.subscribe(() => updateVisuals())

    return button
}

const FabWindow = new Astal.Window({
    name: "fab",
    visible: true,
    child: FabButton(),
})
setClasses(FabWindow, ["fab-window", "position-bottom"])
FabWindow.layer = Astal.Layer.OVERLAY
FabWindow.exclusivity = Astal.Exclusivity.IGNORE
FabWindow.keymode = Astal.Keymode.NONE

modulePosition.subscribe((position) => {
    applyPlacement(FabWindow, getFabPlacement(position))
    setClasses(FabWindow, ["fab-window", getPositionClass(position)])
})

let registered = false
app.connect("startup", () => {
    if (registered) return
    app.add_window(FabWindow)
    registered = true
})
