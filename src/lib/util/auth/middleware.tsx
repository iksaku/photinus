import { ParentProps, Show } from "solid-js";
import { isAuthenticated, token } from ".";
import { cache, createCallbackTrackingSignal } from "..";
import { RedirectMiddleware } from "../middleware"
import { updateToken } from "./util";

export const InitializeAuthentication = (props: ParentProps) => {
    const initialized = createCallbackTrackingSignal(async () => {
        if (!token() && cache.has('firefly:token')) {
            await updateToken(cache.get('firefly:token'))
        }
    })

    return (
        <Show when={initialized()} fallback={<p>🔒 Authenticating...</p>}>
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