import { createSignal } from "solid-js";
import { cache } from "../cache";

type User = {
    id: number
    email: string
}

export const [user, setUser] = createSignal<User>()

export const isAuthenticated = () => !!user()

export function logout() {
    setUser(undefined)
    setToken(undefined)

    cache.forget('firefly:token')
}

export type Token = {
    access_token: string
    refresh_token: string
}

export const [token, setToken] = createSignal<Token>()
export const accessToken = () => token()?.access_token
export const refreshToken = () => token()?.refresh_token