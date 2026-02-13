/**
 * Coming Soon Section - AGS v3
 */

import { Widget } from "ags";
import { Section } from "../components/section.js";

/**
 * Coming Soon Section - Placeholder for future features
 */
export function ComingSoon(sectionNumber: number = 2) {
    return Section({
        title: `Coming Soon ${sectionNumber > 2 ? `#${sectionNumber - 1}` : ''}`.trim(),
        children: [
            Widget.Box({
                class_name: "coming-soon-content",
                child: Widget.Label({
                    label: "Features coming soon...",
                    class_name: "coming-soon-label",
                }),
            }),
        ],
        expanded: false,
        class_name: "coming-soon-section",
    });
}
