import { Navigate, NavigateProps } from "@solidjs/router";
import { Accessor, ParentProps, Show } from "solid-js";

export const RedirectMiddleware = (props: ParentProps<{ condition: Accessor<boolean>, fallback: NavigateProps['href'] }>) => (
    <Show when={props.condition()} fallback={<Navigate href={props.fallback} />}>
        {props.children}
    </Show>
)