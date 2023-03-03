import { createEffect, Show } from "solid-js";
import { createRouteAction, redirect } from "solid-start";
import { cache, sessionCache, str_random, value, zodErrorToLaravelFormat } from "~/lib/util";
import { z, ZodError } from "zod";
import Panel from "~/components/Panel";
import Input from "~/components/Input";

const validator = z.object({
    domain: z.string().url(),
    clientId: z.string().min(1),
    clientSecret: z.string().min(1).max(256)
})

export default function Login() {
    const callbackError = sessionCache.pull('firefly:oauth:callbackError')

    const domain = cache.get('firefly:domain')
    const clientId = cache.get('firefly:oauth:clientId')
    const clientSecret = cache.get('firefly:oauth:clientSecret')

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
            'firefly:oauth:clientSecret': data.clientSecret,
        })

        sessionCache.putMany({
            'firefly:oauth:codeVerifier': codeVerifier,
            'firefly:oauth:state': state
        })

        const url = new URL('/oauth/authorize', data.domain)
        url.search = new URLSearchParams({
            'response_type': 'code',
            'client_id': data.clientId,
            'client_secret': data.clientSecret,
            'code_challenge': codeChallenge,
            'code_challenge_method': 'S256',
            'redirect_uri': `${import.meta.env.VITE_APP_URL}/login/callback`,
            state
        }).toString()

        return redirect(url.toString())
    })

    return (
        <main class="min-h-screen flex flex-col items-center justify-center p-4">
            <Panel class="space-y-6">
                <h1 class="text-center text-2xl">
                    Connect to your
                    <br />
                    FireFly III instance
                </h1>

                <Form class="space-y-6">
                    <Show when={!!callbackError}>
                        <Panel class="bg-red-500">
                            {callbackError}
                        </Panel>
                    </Show>

                    <Input
                        label="Domain"
                        id="domain"
                        name="domain"
                        type="url"
                        value={domain}
                    />
                    <Show when={!!status.error?.errors?.domain}>
                        <span>{status.error.errors.domain[0]}</span>
                    </Show>

                    <Input
                        label="Client Id"
                        id="client_id"
                        name="clientId"
                        type="number"
                        inputMode="numeric"
                        value={clientId}
                    />
                    <Show when={!!status.error?.errors?.clientId}>
                        <span>{status.error.errors.clientId[0]}</span>
                    </Show>

                    <Input
                        label="Client Secret"
                        id="client_secret"
                        name="clientSecret"
                        type="string"
                        value={clientSecret}
                    />

                    <button
                        type="submit"
                        class="w-full bg-indigo-500 text-white px-4 py-2 rounded-md"
                    >
                        Submit
                    </button>
                </Form>
            </Panel>
        </main>
    )
}