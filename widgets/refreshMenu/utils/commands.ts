import { execAsync } from "ags/process"

export interface CommandResult {
    success: boolean
    message: string
}

interface Command {
    label: string
    icon: string
    execute: () => Promise<CommandResult>
}

export const commands: Record<string, Command> = {
    spotify: {
        label: "Spotify",
        icon: "󰓇",
        execute: async () => {
            try {
                await execAsync(["bash", "-lc", "pkill spotify; spotify >/dev/null 2>&1 &"])
                return { success: true, message: "Spotify restarted" }
            } catch (error) {
                return { success: false, message: String(error) }
            }
        },
    },

    spicetify: {
        label: "Spicetify",
        icon: "󰓎",
        execute: async () => {
            try {
                await execAsync([
                    "bash",
                    "-lc",
                    "spicetify apply && pkill spotify; spotify >/dev/null 2>&1 &",
                ])
                return { success: true, message: "Spicetify applied + Spotify restarted" }
            } catch (error) {
                return { success: false, message: String(error) }
            }
        },
    },

    hyprland: {
        label: "Hyprland",
        icon: "󰖲",
        execute: async () => {
            try {
                await execAsync(["hyprctl", "reload"])
                return { success: true, message: "Hyprland config reloaded" }
            } catch (error) {
                return { success: false, message: String(error) }
            }
        },
    },

    rofi: {
        label: "Rofi",
        icon: "󰣇",
        execute: async () => {
            try {
                await execAsync(["bash", "-lc", "pkill rofi; rofi >/dev/null 2>&1 &"])
                return { success: true, message: "Rofi restarted" }
            } catch (error) {
                return { success: false, message: String(error) }
            }
        },
    },

    waybar: {
        label: "Waybar",
        icon: "󰍹",
        execute: async () => {
            try {
                await execAsync(["bash", "-lc", "pkill waybar; waybar >/dev/null 2>&1 &"])
                return { success: true, message: "Waybar restarted" }
            } catch (error) {
                return { success: false, message: String(error) }
            }
        },
    },

    ags: {
        label: "AGS",
        icon: "󱂬",
        execute: async () => {
            try {
                await execAsync([
                    "bash",
                    "-lc",
                    "pkill ags && ags run --gtk 4 >/dev/null 2>&1 &",
                ])
                return { success: true, message: "AGS restarted" }
            } catch (error) {
                return { success: false, message: String(error) }
            }
        },
    },
}

export async function executeCommand(commandKey: string): Promise<CommandResult> {
    if (!commands[commandKey]) {
        return { success: false, message: `Unknown command: ${commandKey}` }
    }

    return commands[commandKey].execute()
}
