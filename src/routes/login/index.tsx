import { Show } from "solid-js";
import { createRouteAction, redirect } from "solid-start";
import { cache, sessionCache, str_random, value, zodErrorToLaravelFormat } from "~/lib/util";
import { z, ZodError } from "zod";
import { GuestMiddleware } from "~/lib/util/auth/middleware";

const validator = z.object({
    domain: z.string().url(),
    clientId: z.string().min(1),
})

export default function Login() {
    const domain = cache.get('firefly:domain')
    const clientId = cache.get('firefly:oauth:clientId')

    const [status, { Form }] = createRouteAction(async (form: FormData) => {
        let data

        try {
            data = validator.parse(Object.fromEntries(form.entries()))
        } catch (e) {
            throw zodErrorToLaravelFormat(e as ZodError)
        }

        const { codeChallenge, codeVerifier } = await value(async () => {
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
        })

        const state = str_random(10)

        cache.putMany({
            'firefly:domain': data.domain,
            'firefly:oauth:clientId': data.clientId,
        })

        sessionCache.putMany({
            'firefly:oauth:codeVerifier': codeVerifier,
            'firefly:oauth:state': state
        })

        const url = new URL('/oauth/authorize', data.domain)
        url.search = new URLSearchParams({
            'response_type': 'code',
            'client_id': data.clientId,
            'code_challenge': codeChallenge,
            'code_challenge_method': 'S256',
            'redirect_uri': 'http://localhost:3000/login/callback',
            state
        }).toString()

        return redirect(url.toString())
    })

    return (
        <GuestMiddleware>
            <main>
                <h1>Login</h1>
                <Form>
                    <label for="domain">Domain</label>
                    <input id="domain" name="domain" type="text" value={domain} />
                    <Show when={!!status.error?.errors.domain}>
                        <span>{status.error.errors.domain[0]}</span>
                    </Show>

                    <label for="client_id">Client ID</label>
                    <input id="client_id" name="clientId" type="text" value={clientId} />
                    <Show when={!!status.error?.errors.clientId}>
                        <span>{status.error.errors.clientId[0]}</span>
                    </Show>

                    <button type="submit">
                        Submit
                    </button>
                </Form>
            </main>
        </GuestMiddleware>
    )
}