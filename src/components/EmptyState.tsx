import { ComponentProps, ParentProps, Show, splitProps } from "solid-js";
import { JSX } from "solid-js";
import { A } from "solid-start";

export default function EmptyState(props: ParentProps<{ icon?: JSX.Element, title: string, description?: string, class?: string }>) {
    return (
        <div class={`text-center ${props.class ?? ''}`}>
            <Show when={!!props.icon}>
                <div class="mx-auto w-12 h-12 text-gray-400">
                    {props.icon}
                </div>
            </Show>

            <h3 class="mt-2 text-sm font-semibold text-gray-900">
                {props.title}
            </h3>
            <Show when={!!props.description}>
                <p class="mt-1 text-sm text-gray-500">
                    {props.description}
                </p>
            </Show>

            {props.children}
        </div>
    )
}

export function EmptyStateAnchor(_props: ComponentProps<typeof A> & { icon?: JSX.Element }) {
    const [props, attributes] = splitProps(_props, ['icon', 'children'])

    return (
        <div class="mt-6">
            <A
                class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                {...attributes}
            >
                <Show when={!!props.icon}>
                    <span class="-ml-0.5 mr-1.5 w-5 h-5">
                        {props.icon}
                    </span>
                </Show>
                {props.children}
            </A>
        </div>
    )
}

export function EmptyStateButton(_props: ComponentProps<'button'> & { icon?: JSX.Element }) {
    const [props, attributes] = splitProps(_props, ['icon', 'children'])

    return (
        <div class="mt-6">
            <button
                type="button"
                class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                {...attributes}
            >
                <Show when={!!props.icon}>
                    <span class="-ml-0.5 mr-1.5 w-5 h-5">
                        {props.icon}
                    </span>
                </Show>
                {props.children}
            </button>
        </div>
    )
}