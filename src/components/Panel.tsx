import { ComponentProps, ParentProps } from "solid-js";

export default function Panel(props: ParentProps<ComponentProps<"div"> & { stretch?: boolean }>) {
    let { children, stretch = false, class: classes, ...attributes } = props

    if (!classes?.includes('bg-')) {
        classes = `bg-white ${classes ?? ''}`
    }

    return (
        <div
            class={`rounded-lg shadow overflow-hidden ${classes}`}
            classList={{
                'px-4 py-5 sm:p-6': !stretch
            }}
            {...attributes}
        >
            {children}
        </div>
    )
}