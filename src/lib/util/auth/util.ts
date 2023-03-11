// Why separate to a different file?
// Because Request class has a dependency on token() signal,
// and these utils invoke a subclass of Request, creating a
// circular dependency 😵‍💫.

import { z } from "zod";
import { GetUserInformation } from "../../api/v1/about";
import { GetOauthToken } from "../../api/oauth";
import { logout, setToken, setUser } from ".";
import { cache, sessionCache } from "../cache";
import { LaravelError } from "~/lib/api/Request";

async function fetchUserInformation(token: string) {
    setUser(
        await new GetUserInformation()
            .withBearerToken(token)
            .send()
    )
}

export async function attemptLogin(token?: Awaited<ReturnType<GetOauthToken['send']>>) {
    if (!token && !cache.has('firefly:token')) {
        return
    }

    if (!token) {
        try {
            const validator = z.object({
                access_token: z.string().min(1),
                refresh_token: z.string().min(1)
            })

            token = validator.parse(cache.get('firefly:token'))
        } catch {
            logout()
            return
        }
    }

    try {
        await fetchUserInformation(token.access_token)
        setToken(token)
        cache.put('firefly:token', token)
    } catch (e) {
        if ((e as LaravelError).response.status !== 401 && (e as LaravelError).response.status !== 403) {
            sessionCache.put('firefly:oauth:callbackError', `Unknown error status [${(e as LaravelError).response.status}] from server.`)
            return
        }

        await attemptRefreshLogin(token.refresh_token)
    }
}

export async function attemptRefreshLogin(refreshToken: string) {
    let token

    try {
        token = await new GetOauthToken()
            .withFormData({
                'grant_type': 'refresh_token',
                'client_id': cache.get('firefly:oauth:clientId'),
                'client_secret': cache.get('firefly:oauth:clientSecret'),
                'refresh_token': refreshToken,
            })
            .send()

        await fetchUserInformation(token.access_token)
        setToken(token)
        cache.put('firefly:token', token)
    } catch {
        logout()
    }
}