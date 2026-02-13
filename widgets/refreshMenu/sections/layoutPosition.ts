import { Gtk } from "ags/gtk4"

import { Section } from "../components/section.js"
import {
    modulePosition,
    setModulePosition,
    type ModulePosition,
} from "../controller/layout.js"

function setClasses(widget: Gtk.Widget, classes: string[]) {
    widget.set_css_classes(classes)
}

function PositionButton(position: ModulePosition, icon: string, labelText: string) {
    const iconLabel = new Gtk.Label({ label: icon })
    setClasses(iconLabel, ["position-button-icon"])

    const label = new Gtk.Label({ label: labelText })
    setClasses(label, ["position-button-label"])

    const content = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 8,
    })
    setClasses(content, ["position-button-content"])
    content.append(iconLabel)
    content.append(label)

    const button = new Gtk.Button({ child: content, hexpand: true })
    setClasses(button, ["position-button"])
    button.connect("clicked", () => {
        setModulePosition(position)
    })

    modulePosition.subscribe((current) => {
        setClasses(button, [
            "position-button",
            current === position ? "is-active" : "is-inactive",
        ])
    })

    return button
}

export function PositionControls() {
    const rowOne = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 8,
    })
    setClasses(rowOne, ["position-row"])
    rowOne.append(PositionButton("top", "󰁝", "Top"))
    rowOne.append(PositionButton("bottom", "󰁅", "Bottom"))

    const rowTwo = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 8,
    })
    setClasses(rowTwo, ["position-row"])
    rowTwo.append(PositionButton("left", "󰁍", "Left"))
    rowTwo.append(PositionButton("right", "󰁔", "Right"))

    const wrapper = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 8,
    })
    setClasses(wrapper, ["position-controls"])
    wrapper.append(rowOne)
    wrapper.append(rowTwo)

    return Section({
        title: "Menu Position",
        children: [wrapper],
        expanded: true,
        class_name: "position-section",
    })
}
