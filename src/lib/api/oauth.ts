import { createRouteAction, redirect, useSearchParams } from "solid-start"
import { z, ZodError } from "zod"
import { cache, normalizeUrl, sessionCache, str_random } from "../util"
import { HttpClient } from "../HttpClient"

export function useOauthAuthorize() {
    const validator = z.object({
        domain: z.string().url(),
        clientId: z.string(),
    })

    async function generateCodeChallenge(): Promise<{ codeChallenge: string, codeVerifier: string }> {
        let codeVerifier = str_random(128)

        const codeChallenge = btoa(
            String.fromCharCode.apply(
                null,
                // @ts-ignore
                new Uint8Array(
                    await crypto.subtle.digest(
                        'SHA-256',
                        new TextEncoder().encode(codeVerifier)
                    )
                )
            )
        )
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "")

        return { codeChallenge, codeVerifier }
    }

    return createRouteAction(async (form: FormData) => {
        let data

        try {
            data = validator.parse(Object.fromEntries(form.entries()))
        } catch (e) {
            throw (e as ZodError).format()
        }

        const { codeChallenge, codeVerifier } = await generateCodeChallenge()
        const state = str_random(10)

        cache.put('firefly:domain', data.domain)
        sessionCache.putMany({
            'firefly:oauth:clientId': data.clientId,
            'firefly:oauth:codeVerifier': codeVerifier,
            'firefly:oauth:state': state
        })

        return redirect(
            normalizeUrl('/oauth/authorize', {
                'response_type': 'code',
                'client_id': data.clientId,
                'code_challenge': codeChallenge,
                'code_challenge_method': 'S256',
                'redirect_uri': 'http://localhost:3000/oauth/callback',
                state
            })
                .toString()
        )
    })
}

export function useOauthCallback() {
    return createRouteAction(async () => {
        const [params] = useSearchParams<{ code: string, state: string }>()

        const state = sessionCache.get('firefly:oauth:state')

        if (state !== params.state) {
            throw 'Invalid OAuth State'
        }

        const data = await new HttpClient().asForm().post('/oauth/token', {
            grant_type: 'authorization_code',
            client_id: sessionCache.get('firefly:oauth:clientId'),
            code: params.code,
            code_verifier: sessionCache.get('firefly:oauth:codeVerifier'),
            redirect_uri: 'http://localhost:3000/oauth/callback'
        })

        // TODO: Save token, refresh token and expiration time

        console.log(data)
    })
}