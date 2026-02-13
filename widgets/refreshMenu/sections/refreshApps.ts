import GLib from "gi://GLib?version=2.0"

import { Gtk } from "ags/gtk4"
import { Section } from "../components/section.js"
import { commands, executeCommand } from "../utils/commands.js"

function setClasses(widget: Gtk.Widget, classes: string[]) {
    widget.set_css_classes(classes)
}

function RefreshButton(commandKey: string, command: { label: string; icon: string }) {
    let isLoading = false

    const icon = new Gtk.Label({ label: command.icon })
    setClasses(icon, ["refresh-button-icon"])

    const label = new Gtk.Label({
        label: command.label,
        hexpand: true,
        xalign: 0,
    })
    setClasses(label, ["refresh-button-label"])

    const spinner = new Gtk.Spinner({ spinning: false, visible: false })
    setClasses(spinner, ["refresh-button-spinner"])

    const content = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 12,
    })
    setClasses(content, ["refresh-button-content"])
    content.append(icon)
    content.append(label)
    content.append(spinner)

    const button = new Gtk.Button({ child: content })
    setClasses(button, ["refresh-button"])

    button.connect("clicked", async () => {
        if (isLoading) return

        isLoading = true
        spinner.set_visible(true)
        spinner.set_spinning(true)

        const result = await executeCommand(commandKey)
        if (result.success) {
            print(`✓ ${result.message}`)
        } else {
            print(`✗ ${result.message}`)
        }

        GLib.timeout_add(GLib.PRIORITY_DEFAULT, 300, () => {
            spinner.set_spinning(false)
            spinner.set_visible(false)
            isLoading = false
            return GLib.SOURCE_REMOVE
        })
    })

    return button
}

export function RefreshApps() {
    const buttons = Object.entries(commands).map(([key, cmd]) => RefreshButton(key, cmd))

    return Section({
        title: "Refresh Apps",
        children: buttons,
        expanded: true,
        class_name: "refresh-apps-section",
    })
}
