// Why separate to a different file?
// Because Request class has a dependency on token() signal,
// and these utils invoke a subclass of Request, creating a
// circular dependency 😵‍💫.

import { createEffect } from "solid-js";
import { useNavigate } from "solid-start";
import { z } from "zod";
import { GetUserInformation } from "../../api/about";
import { GetOauthToken } from "../../api/oauth";
import { isAuthenticated, logout, setToken, setUser, token, Token, user } from ".";
import { cache } from "../cache";

async function fetchUserData(token?: Token) {
    const response = await new GetUserInformation()
        .withBearerToken(token?.access_token)
        .send()

    setUser({
        id: parseInt(response.data.id),
        email: response.data.attributes.email
    })
}

export async function updateToken(newToken: Token) {
    try {
        const validator = z.object({
            access_token: z.string().min(1),
            refresh_token: z.string().min(1)
        })

        // Always remove unecessary data
        newToken = validator.parse(newToken)
    } catch {
        logout()
    }

    try {
        await fetchUserData(newToken)
        cache.put('firefly:token', newToken)
        setToken(newToken)
    } catch {
        // TODO: Way to differentiate token expiration from other types of issues
        await refreshToken()
    }
}

export async function refreshToken(): Promise<void> {
    if (!token()?.refresh_token) {
        logout()
    }

    try {
        const newToken = await new GetOauthToken()
            .withFormData({
                'grant_type': 'refresh_token',
                'client_id': cache.get('firefly:oauth:clientId'),
                'refresh_token': token()!.refresh_token,
            })
            .send()

        updateToken(newToken)
    } finally {
        logout()
    }
}

export async function initializeToken() {
    if (!!token()) {
        return
    }

    if (cache.has('firefly:token')) {
        await updateToken(cache.get('firefly:token'))
    }
}
