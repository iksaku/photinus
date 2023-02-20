export function str_random(length: number): string
{
    // Taken from: https://quickref.me/generate-a-random-string-with-given-length
    return Array(length)
        .fill('')
        .map((v) => Math.random().toString(36).charAt(2))
        .join('')
}

const cacheBuilder = (storage: Storage) => ({
    get(key: string, _default: unknown = null) {
        const value = storage.getItem(key)

        if (!value) {
            return _default
        }

        return JSON.parse(value)
    },
    put(key: string, value: unknown): void {
        storage.setItem(key, JSON.stringify(value))
    },
    putMany(values: Record<string, unknown>): void {
        for (const [key, value] of Object.entries(values)) {
            this.put(key, value)
        }
    },
    forget(...keys: string[]): void {
        for (const key of keys) {
            storage.removeItem(key)
        }
    },
} as const)

export const cache = cacheBuilder(localStorage)
export const sessionCache = cacheBuilder(sessionStorage)

export type URLInit = string | URL
export type URLSearchParamsInit = Record<string, any> | URLSearchParams

export function normalizeUrl(url: URLInit, params ?: URLSearchParamsInit): URL {
    if (!(url instanceof URL)) {
        url = new URL(url, cache.get('firefly:domain'))
    }

    if (!!params) {
        params = new URLSearchParams(params)

        for (const [key, value] of params.entries()) {
            url.searchParams.set(key, value)
        }
    }

    return url
}

export function tap<T = any>(value: T, callback: (value: T) => void): T {
    callback(value)

    return value
}