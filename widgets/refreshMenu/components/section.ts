import { Gtk } from "ags/gtk4"

export interface SectionProps {
    title: string
    children?: Gtk.Widget[]
    expanded?: boolean
    class_name?: string
}

function setClasses(widget: Gtk.Widget, classes: string[]) {
    widget.set_css_classes(classes)
}

export function Section({
    title,
    children = [],
    expanded = true,
    class_name = "",
}: SectionProps) {
    let isExpanded = expanded

    const titleLabel = new Gtk.Label({
        label: title,
        hexpand: true,
        xalign: 0,
    })
    setClasses(titleLabel, ["section-title"])

    const chevron = new Gtk.Label({
        label: expanded ? "▾" : "▸",
    })
    setClasses(chevron, ["section-chevron"])

    const headerContent = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 8,
    })
    headerContent.append(titleLabel)
    headerContent.append(chevron)

    const header = new Gtk.Button({ child: headerContent })
    setClasses(header, ["section-header"])

    const contentBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 6,
    })
    setClasses(contentBox, ["section-content"])
    for (const child of children) {
        contentBox.append(child)
    }

    const content = new Gtk.Revealer({
        transition_type: Gtk.RevealerTransitionType.SLIDE_DOWN,
        transition_duration: 200,
        reveal_child: expanded,
        child: contentBox,
    })

    header.connect("clicked", () => {
        isExpanded = !isExpanded
        content.set_reveal_child(isExpanded)
        chevron.set_label(isExpanded ? "▾" : "▸")
    })

    const section = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 8,
    })

    const baseClasses = ["section"]
    if (class_name.trim().length > 0) {
        baseClasses.push(...class_name.trim().split(/\s+/))
    }
    setClasses(section, baseClasses)

    section.append(header)
    section.append(content)

    return section
}
