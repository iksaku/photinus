import { createSignal, ParentProps, Show } from "solid-js";
import { isAuthenticated, token } from ".";
import { cache, value } from "..";
import { RedirectMiddleware } from "../Middleware"
import { updateToken } from "./util";

export const InitializeAuthentication = (props: ParentProps) => {
    const [initialized, setInitialized] = createSignal(false)
    value(async () => {
        if (!token() && cache.has('firefly:token')) {
            await updateToken(cache.get('firefly:token'))
        }

        setInitialized(true)
    })

    return (
        <Show when={initialized()} fallback={<p>Loading...</p>}>
            {props.children}
        </Show>
    )
}

export const AuthenticatedMiddleware = (props: ParentProps) => (
    <RedirectMiddleware condition={isAuthenticated} fallback="/login">
        {props.children}
    </RedirectMiddleware>
)

export const GuestMiddleware = (props: ParentProps) => (
    <RedirectMiddleware condition={() => !isAuthenticated()} fallback="/">
        {props.children}
    </RedirectMiddleware>
)