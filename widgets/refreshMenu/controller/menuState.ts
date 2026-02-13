export type Variable<T> = {
    get: () => T
    set: (value: T) => void
    toggle: () => void
    subscribe: (callback: (value: T) => void) => () => void
}

function createBooleanVariable(initial: boolean): Variable<boolean> {
    let value = initial
    const subscribers = new Set<(value: boolean) => void>()

    const notify = () => {
        for (const callback of subscribers) {
            callback(value)
        }
    }

    return {
        get: () => value,
        set: (next: boolean) => {
            if (Object.is(value, next)) return
            value = next
            notify()
        },
        toggle: () => {
            value = !value
            notify()
        },
        subscribe: (callback: (value: boolean) => void) => {
            subscribers.add(callback)
            callback(value)
            return () => subscribers.delete(callback)
        },
    }
}

export const menuState: Variable<boolean> = createBooleanVariable(false)

export function openMenu() {
    menuState.set(true)
}

export function closeMenu() {
    menuState.set(false)
}

export function toggleMenu() {
    menuState.toggle()
}
