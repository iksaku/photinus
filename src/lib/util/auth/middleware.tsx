import { ParentProps, Show } from "solid-js";
import Spinner from "~/components/Spinner";
import { isAuthenticated, token } from ".";
import { cache, createLoadingSignal } from "..";
import { RedirectMiddleware } from "../middleware"
import { updateToken } from "./util";

export const InitializeAuthentication = (props: ParentProps) => {
    const [initializing] = createLoadingSignal(async () => {
        if (!token() && cache.has('firefly:token')) {
            await updateToken(cache.get('firefly:token'))
        }
    })

    return (
        <Show when={initializing()} fallback={props.children}>
            <main class="min-h-screen flex flex-col items-center justify-center space-y-6 p-4">
                <Spinner class="w-10 h-10" />
            </main>
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