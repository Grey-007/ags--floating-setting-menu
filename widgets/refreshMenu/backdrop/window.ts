import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"

import { closeMenu, menuState } from "../controller/menuState.js"

function setClasses(widget: Gtk.Widget, classes: string[]) {
    widget.set_css_classes(classes)
}

const scrimButton = new Gtk.Button({
    hexpand: true,
    vexpand: true,
})
setClasses(scrimButton, ["menu-backdrop-scrim"])
scrimButton.connect("clicked", () => {
    closeMenu()
})

const scrimRevealer = new Gtk.Revealer({
    transition_type: Gtk.RevealerTransitionType.CROSSFADE,
    transition_duration: 120,
    reveal_child: false,
    child: scrimButton,
})

const Backdrop = new Astal.Window({
    name: "refresh-menu-backdrop",
    visible: false,
    child: scrimRevealer,
})
setClasses(Backdrop, ["menu-backdrop-window", "is-closed"])
Backdrop.anchor =
    Astal.WindowAnchor.TOP |
    Astal.WindowAnchor.BOTTOM |
    Astal.WindowAnchor.LEFT |
    Astal.WindowAnchor.RIGHT
Backdrop.layer = Astal.Layer.TOP
Backdrop.exclusivity = Astal.Exclusivity.IGNORE
Backdrop.keymode = Astal.Keymode.NONE

menuState.subscribe((open) => {
    if (open) {
        Backdrop.visible = true
        setClasses(Backdrop, ["menu-backdrop-window", "is-open"])
        scrimRevealer.set_reveal_child(true)
        return
    }

    setClasses(Backdrop, ["menu-backdrop-window", "is-closed"])
    scrimRevealer.set_reveal_child(false)
})

scrimRevealer.connect("notify::child-revealed", () => {
    if (!scrimRevealer.get_reveal_child() && !scrimRevealer.get_child_revealed()) {
        Backdrop.visible = false
    }
})

let registered = false
app.connect("startup", () => {
    if (registered) return
    app.add_window(Backdrop)
    registered = true
})
