/**
 * Section Component - AGS v3
 */

import { Widget, Variable } from "ags";

interface SectionProps {
    title: string;
    children?: any[];
    expanded?: boolean;
    class_name?: string;
}

/**
 * Section component - Creates an expandable section header with content
 */
export function Section({ 
    title, 
    children = [], 
    expanded = true, 
    class_name = "" 
}: SectionProps) {
    const isExpanded = Variable(expanded);
    
    const header = Widget.Button({
        class_name: "section-header",
        on_clicked: () => isExpanded.value = !isExpanded.value,
        child: Widget.Box({
            children: [
                Widget.Label({
                    label: title,
                    class_name: "section-title",
                    hexpand: true,
                    xalign: 0,
                }),
                Widget.Label({
                    class_name: "section-chevron",
                    setup: (self) => {
                        self.hook(isExpanded, () => {
                            self.label = isExpanded.value ? "" : "";
                        });
                    },
                }),
            ],
        }),
    });
    
    const content = Widget.Revealer({
        reveal_child: isExpanded.bind(),
        transition: "slide_down",
        transition_duration: 200,
        child: Widget.Box({
            class_name: "section-content",
            vertical: true,
            children: children,
        }),
    });
    
    return Widget.Box({
        class_name: `section ${class_name}`,
        vertical: true,
        children: [header, content],
    });
}
