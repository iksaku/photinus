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
            .replace(/\/*$/, ''),
        ''
    )
}

export async function wait(ms?: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
}

export function createLoadingSignal(callback: any): Accessor<boolean>[] {
    const [loading, setLoading] = createSignal(true)
    value(async () => {
        await value(callback)
        setLoading(false)
    })

    const loaded = () => !loading()

    return [loading, loaded]
}

export function firstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function lastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function toLaravelDate(date: Date): string {
    const zeroPad = (number: number) => number.toString().padStart(2, '0')

    return `${date.getFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(date.getDate())}`
}