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

    const baseClasses = ["section"]
    if (class_name.trim().length > 0) {
        baseClasses.push(...class_name.trim().split(/\s+/))
    }

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
    setClasses(contentBox, ["section-content", expanded ? "is-expanded" : "is-collapsed"])
    for (const child of children) {
        contentBox.append(child)
    }

    const content = new Gtk.Revealer({
        transition_type: Gtk.RevealerTransitionType.SLIDE_DOWN,
        transition_duration: 200,
        reveal_child: expanded,
        child: contentBox,
    })

    const section = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 8,
    })

    const updateVisualState = (expandedState: boolean) => {
        setClasses(section, [...baseClasses, expandedState ? "is-expanded" : "is-collapsed"])
        setClasses(contentBox, [
            "section-content",
            expandedState ? "is-expanded" : "is-collapsed",
        ])
        chevron.set_label(expandedState ? "▾" : "▸")
    }

    updateVisualState(expanded)

    header.connect("clicked", () => {
        isExpanded = !isExpanded
        content.set_reveal_child(isExpanded)
        updateVisualState(isExpanded)
    })

    section.append(header)
    section.append(content)

    return section
}
