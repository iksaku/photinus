import { createRouteAction, redirect, useSearchParams } from "solid-start";
import { GetOauthToken } from "~/lib/api/oauth";
import { cache, sessionCache } from "~/lib/util";
import { GuestMiddleware, updateToken } from "~/lib/util/authUtils";

export default function Callback() {
    const [status, requestToken] = createRouteAction(async () => {
        const [params] = useSearchParams<{ code: string, state: string }>()

        // const state = sessionCache.pull('firefly:oauth:state')

        // if (state !== params.state) {
        //     throw 'Invalid OAuth State'
        // }

        const data = await new GetOauthToken()
            .withFormData({
                grant_type: 'authorization_code',
                client_id: cache.get('firefly:oauth:clientId'),
                code: params.code,
                code_verifier: sessionCache.pull('firefly:oauth:codeVerifier'),
                redirect_uri: 'http://localhost:3000/login/callback'
            })
            .send()

        try {
            await updateToken(data)
        } catch {
            return redirect('/login')
        }

        return redirect('/')
    })

    requestToken()

    // TODO: createEffect() that catches errors and redirects back to login
    // TODO: Loading state

    return (
        <GuestMiddleware>
            
        </GuestMiddleware>
    )
}