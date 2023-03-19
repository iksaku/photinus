import { ComponentProps, ParentProps, splitProps } from "solid-js";

export default function Panel(_props: ParentProps<ComponentProps<"div"> & { stretch?: boolean }>) {
    const [props, attributes] = splitProps(_props, ['stretch', 'class', 'children'])

    return (
        <div
            class={`rounded-lg shadow contain-paint ${props.class}`}
            classList={{
                'bg-white': !props.class?.includes('bg-'),
                'p-4 sm:p-6': !(props.stretch ?? false)
            }}
            {...attributes}
        >
            {props.children}
        </div>
    )
}