import { tap } from "."

class Cache {
    public constructor(protected storage: Storage) {
    }

    public has(key: string): boolean {
        return !!this.storage.getItem(key)
    }

    public get(key: string, _default: unknown = null) {
        const value = this.storage.getItem(key)

        if (!value) {
            return _default
        }

        return JSON.parse(value)
    }

    public put(key: string, value: unknown): void {
        this.storage.setItem(key, JSON.stringify(value))
    }

    public putMany(values: Record<string, unknown>): void {
        for (const [key, value] of Object.entries(values)) {
            this.put(key, value)
        }
    }

    public pull(key: string, _default: unknown = null) {
        return tap(this.get(key, _default), () => {
            this.forget(key)
        })
    }

    public forget(...keys: string[]): void {
        for (const key of keys) {
            this.storage.removeItem(key)
        }
    }
}

export const cache = new Cache(localStorage)
export const sessionCache = new Cache(sessionStorage)