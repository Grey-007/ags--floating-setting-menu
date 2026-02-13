import GLib from "gi://GLib?version=2.0"
import { Astal } from "ags/gtk4"

export type ModulePosition = "bottom" | "top" | "left" | "right"

export interface Placement {
    anchor: number
    marginTop: number
    marginRight: number
    marginBottom: number
    marginLeft: number
}

export type Variable<T> = {
    get: () => T
    set: (value: T) => void
    subscribe: (callback: (value: T) => void) => () => void
}

const STATE_DIR = `${GLib.get_user_state_dir()}/ags`
const POSITION_FILE = `${STATE_DIR}/refresh-menu-position`

function parsePosition(value: string): ModulePosition {
    switch (value.trim()) {
        case "top":
        case "left":
        case "right":
            return value.trim()
        case "bottom":
        default:
            return "bottom"
    }
}

function readPersistedPosition(): ModulePosition {
    try {
        const [ok, contents] = GLib.file_get_contents(POSITION_FILE)
        if (!ok || !contents) return "bottom"
        return parsePosition(new TextDecoder().decode(contents))
    } catch {
        return "bottom"
    }
}

function persistPosition(position: ModulePosition) {
    try {
        GLib.mkdir_with_parents(STATE_DIR, 0o755)
        GLib.file_set_contents(POSITION_FILE, position)
    } catch {
        // ignore persistence errors
    }
}

function createVariable<T>(initial: T): Variable<T> {
    let value = initial
    const subscribers = new Set<(value: T) => void>()

    const notify = () => {
        for (const callback of subscribers) {
            callback(value)
        }
    }

    return {
        get: () => value,
        set: (next: T) => {
            if (Object.is(value, next)) return
            value = next
            notify()
        },
        subscribe: (callback: (value: T) => void) => {
            subscribers.add(callback)
            callback(value)
            return () => subscribers.delete(callback)
        },
    }
}

const EDGE = 0
const BOTTOM_DOCK_OFFSET = -7
const FAB_SIZE = 56
const GAP = 10

const bottomFab: Placement = {
    anchor: Astal.WindowAnchor.BOTTOM,
    marginTop: 0,
    marginRight: 0,
    marginBottom: EDGE + BOTTOM_DOCK_OFFSET,
    marginLeft: 0,
}

const topFab: Placement = {
    anchor: Astal.WindowAnchor.TOP,
    marginTop: EDGE,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
}

const leftFab: Placement = {
    anchor: Astal.WindowAnchor.LEFT,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: EDGE,
}

const rightFab: Placement = {
    anchor: Astal.WindowAnchor.RIGHT,
    marginTop: 0,
    marginRight: EDGE,
    marginBottom: 0,
    marginLeft: 0,
}

const bottomMenu: Placement = {
    anchor: Astal.WindowAnchor.BOTTOM,
    marginTop: 0,
    marginRight: 0,
    marginBottom: EDGE + FAB_SIZE + GAP + BOTTOM_DOCK_OFFSET,
    marginLeft: 0,
}

const topMenu: Placement = {
    anchor: Astal.WindowAnchor.TOP,
    marginTop: EDGE + FAB_SIZE + GAP,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
}

const leftMenu: Placement = {
    anchor: Astal.WindowAnchor.LEFT,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: EDGE + FAB_SIZE + GAP,
}

const rightMenu: Placement = {
    anchor: Astal.WindowAnchor.RIGHT,
    marginTop: 0,
    marginRight: EDGE + FAB_SIZE + GAP,
    marginBottom: 0,
    marginLeft: 0,
}

export const modulePosition = createVariable<ModulePosition>(readPersistedPosition())

export function setModulePosition(position: ModulePosition) {
    modulePosition.set(position)
    persistPosition(position)
}

export function getFabPlacement(position: ModulePosition): Placement {
    switch (position) {
        case "top":
            return topFab
        case "left":
            return leftFab
        case "right":
            return rightFab
        case "bottom":
        default:
            return bottomFab
    }
}

export function getMenuPlacement(position: ModulePosition): Placement {
    switch (position) {
        case "top":
            return topMenu
        case "left":
            return leftMenu
        case "right":
            return rightMenu
        case "bottom":
        default:
            return bottomMenu
    }
}

export function getPositionClass(position: ModulePosition): string {
    return `position-${position}`
}
