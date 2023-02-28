import { ParentProps } from "solid-js";

function BasePanel(props: ParentProps<{ class: string }>) {
    return (
        <div class={`px-4 py-5 sm:p-6 rounded-lg shadow overflow-hidden ${props.class}`}>
            {props.children}
        </div>
    )
}

export function ErrorPanel(props: ParentProps<{ class?: string }>) {
    return (
        <BasePanel class={`bg-red-200 ${props.class ?? ''}`}>
            {props.children}
        </BasePanel>
    )
}

export default function Panel(props: ParentProps<{ class?: string }>) {
    return (
        <BasePanel class={`bg-white ${props.class ?? ''}`}>
            {props.children}
        </BasePanel>
    )
}