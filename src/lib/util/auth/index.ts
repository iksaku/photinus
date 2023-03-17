import { createSignal } from "solid-js";
import { GetUserInformation } from "~/lib/api/v1/about";
import { cache } from "../cache";

export const [user, setUser] = createSignal<Awaited<ReturnType<GetUserInformation['send']>>['data']>()

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