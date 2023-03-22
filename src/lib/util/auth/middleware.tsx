import { ParentProps, Show } from "solid-js";
import { LoadingPage } from "~/components/Page";
import { isAuthenticated } from ".";
import { createLoadingSignal } from "..";
import { RedirectMiddleware } from "../Middleware"
import { attemptLogin } from "./util";

export const InitializeAuthentication = (props: ParentProps) => {
    const [initializing] = createLoadingSignal(attemptLogin)

    return (
        <Show when={initializing()} fallback={props.children}>
            <LoadingPage fullPage={true} />
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