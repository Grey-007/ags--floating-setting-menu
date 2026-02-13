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

const EDGE = 24
const FAB_SIZE = 56
const GAP = 14

const bottomFab: Placement = {
    anchor: Astal.WindowAnchor.BOTTOM,
    marginTop: 0,
    marginRight: 0,
    marginBottom: EDGE,
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
    marginBottom: EDGE + FAB_SIZE + GAP,
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

export const modulePosition = createVariable<ModulePosition>("bottom")

export function setModulePosition(position: ModulePosition) {
    modulePosition.set(position)
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
