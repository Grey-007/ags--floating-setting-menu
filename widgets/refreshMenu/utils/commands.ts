/**
 * Command Registry - AGS v3
 */

import { Utils } from "ags";

interface CommandResult {
    success: boolean;
    message: string;
}

interface Command {
    label: string;
    icon: string;
    execute: () => Promise<CommandResult>;
}

/**
 * Command registry for refresh actions
 */
export const commands: Record<string, Command> = {
    spotify: {
        label: "Spotify",
        icon: "󰓇",
        execute: async () => {
            try {
                await Utils.execAsync(['bash', '-c', 'pkill spotify && spotify &']);
                return { success: true, message: "Spotify restarted" };
            } catch (error) {
                return { success: false, message: String(error) };
            }
        }
    },
    
    hyprland: {
        label: "Hyprland",
        icon: "",
        execute: async () => {
            try {
                await Utils.execAsync(['hyprctl', 'reload']);
                return { success: true, message: "Hyprland config reloaded" };
            } catch (error) {
                return { success: false, message: String(error) };
            }
        }
    },
    
    rofi: {
        label: "Rofi",
        icon: "",
        execute: async () => {
            try {
                await Utils.execAsync(['bash', '-c', 'pkill rofi && rofi &']);
                return { success: true, message: "Rofi restarted" };
            } catch (error) {
                return { success: false, message: String(error) };
            }
        }
    },
    
    waybar: {
        label: "Waybar",
        icon: "",
        execute: async () => {
            try {
                await Utils.execAsync(['bash', '-c', 'pkill waybar && waybar &']);
                return { success: true, message: "Waybar restarted" };
            } catch (error) {
                return { success: false, message: String(error) };
            }
        }
    },
    
    ags: {
        label: "AGS",
        icon: "",
        execute: async () => {
            try {
                Utils.exec('ags quit');
                // AGS will auto-restart if managed by Hyprland
                return { success: true, message: "AGS quit" };
            } catch (error) {
                return { success: false, message: String(error) };
            }
        }
    }
};

/**
 * Execute a command by key
 */
export async function executeCommand(commandKey: string): Promise<CommandResult> {
    if (!commands[commandKey]) {
        return { success: false, message: `Unknown command: ${commandKey}` };
    }
    
    return await commands[commandKey].execute();
}
