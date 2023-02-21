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

export function joinPath(...parts: string[]) {
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