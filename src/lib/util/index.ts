import { Accessor, createSignal } from 'solid-js'

export * from './auth'
export * from './cache'
export * from './zod'

export function str_random(length: number): string {
    // Taken from: https://quickref.me/generate-a-random-string-with-given-length
    return Array(length)
        .fill('')
        .map((v) => Math.random().toString(36).charAt(2))
        .join('')
}

export function tap<T = any>(value: T, callback: (value: T) => void): T {
    callback(value)

    return value
}

export function value<T = any>(val: T, ...args: any): T extends ((...args: any) => infer R) ? R : T
{
    if (typeof val == 'function') {
        return val(...args)
    }

    return val as any
}

export function joinPath(...parts: string[]): string {
    return parts.reduce(
        (carry: string, path: string) => carry + '/' + path
            // Remove leading slash
            .replace(/^\/*/, '')
            // Remove trailing slash
            .replace(/\/*$/, '')
    )
}

export function mergeEntries<T extends object>(entry: T, ...entries: T[]): T {
    return Object.assign(entry, ...entries)
}

export async function wait(ms?: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
}

export function createCallbackTrackingSignal<T = any>(callback: any): Accessor<boolean> {
    const [finished, setFinished] = createSignal(false)
    value(async () => {
        await value(callback)
        setFinished(true)
    })

    return finished
}

export function formatNumber(number: number|string): string {
    // Add thousand separator to number
    // Taken from: https://stackoverflow.com/a/2901298
    return number
        .toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}