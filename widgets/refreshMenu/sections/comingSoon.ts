import { Gtk } from "ags/gtk4"

import { Section } from "../components/section.js"

function setClasses(widget: Gtk.Widget, classes: string[]) {
    widget.set_css_classes(classes)
}

export function ComingSoon(sectionNumber = 2) {
    const box = new Gtk.Box()
    setClasses(box, ["coming-soon-content"])

    const label = new Gtk.Label({
        label: "Features coming soon...",
    })
    setClasses(label, ["coming-soon-label"])

    box.append(label)

    return Section({
        title: `Coming Soon ${sectionNumber > 2 ? `#${sectionNumber - 1}` : ""}`.trim(),
        children: [box],
        expanded: false,
        class_name: "coming-soon-section",
    })
}
