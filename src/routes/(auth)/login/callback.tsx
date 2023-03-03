import { Navigate, useSearchParams } from "solid-start";
import { GetOauthToken } from "~/lib/api/oauth";
import { cache, createLoadingSignal, sessionCache } from "~/lib/util";
import { updateToken } from "~/lib/util/auth/util";
import { Show } from "solid-js";
import Spinner from "~/components/Spinner";
import { LaravelError } from "~/lib/api/Request";

export default function Callback() {
    const [loading] = createLoadingSignal(async () => {
        const [params] = useSearchParams<{ code: string, state: string }>()

        const state = sessionCache.pull('firefly:oauth:state')

        if (state !== params.state) {
            sessionCache.put('firefly:oauth:callbackError', 'Invalid OAuth State')
            return
        }

        try {
            const data = await new GetOauthToken()
                .withFormData({
                    grant_type: 'authorization_code',
                    client_id: cache.get('firefly:oauth:clientId'),
                    client_secret: cache.get('firefly:oauth:clientSecret'),
                    code: params.code,
                    code_verifier: sessionCache.pull('firefly:oauth:codeVerifier'),
                    redirect_uri: `${import.meta.env.VITE_APP_URL}/login/callback`,
                })
                .send()

            await updateToken(data)
        } catch (e) {
            sessionCache.put('firefly:oauth:callbackError', (e as LaravelError).message)
            return
        }
    })

    return (
        <Show when={loading()} fallback={<Navigate href="/login" />}>
            <div class="min-h-screen flex flex-col items-center justify-center space-y-6 p-4">
                <p class="text-center text-2xl">
                    Authenticating
                </p>

                <Spinner class="w-10 h-10" />
            </div>
        </Show>
    )
}