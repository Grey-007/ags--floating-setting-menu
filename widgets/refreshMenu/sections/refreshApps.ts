/**
 * Refresh Apps Section - AGS v3
 */

import { Widget, Variable } from "ags";
import { Section } from "../components/section.js";
import { commands, executeCommand } from "../utils/commands.js";

/**
 * Create a refresh button for a specific command
 */
function RefreshButton(commandKey: string, command: any) {
    const isLoading = Variable(false);
    
    return Widget.Button({
        class_name: "refresh-button",
        on_clicked: async () => {
            if (isLoading.value) return;
            
            isLoading.value = true;
            const result = await executeCommand(commandKey);
            
            // Show feedback
            if (result.success) {
                print(`✓ ${result.message}`);
            } else {
                print(`✗ ${result.message}`);
            }
            
            // Brief delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 300));
            isLoading.value = false;
        },
        child: Widget.Box({
            class_name: "refresh-button-content",
            children: [
                Widget.Label({
                    class_name: "refresh-button-icon",
                    label: command.icon,
                }),
                Widget.Label({
                    class_name: "refresh-button-label",
                    label: command.label,
                    hexpand: true,
                    xalign: 0,
                }),
                Widget.Spinner({
                    class_name: "refresh-button-spinner",
                    active: isLoading.bind(),
                }),
            ],
        }),
    });
}

/**
 * Refresh Apps Section
 */
export function RefreshApps() {
    const buttons = Object.entries(commands).map(([key, cmd]) => 
        RefreshButton(key, cmd)
    );
    
    return Section({
        title: "Refresh Apps",
        children: buttons,
        expanded: true,
        class_name: "refresh-apps-section",
    });
}
