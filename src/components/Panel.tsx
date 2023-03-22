import { ComponentProps, ParentProps, splitProps } from "solid-js";

export default function Panel(_props: ParentProps<ComponentProps<"div"> & { stretch?: boolean }>) {
    const [props, attributes] = splitProps(_props, ['stretch', 'children', 'class'])

    return (
        <div
            classList={{
                [props.class ?? '']: true,
                'rounded-lg shadow contain-paint': true,
                'bg-white': !props.class?.includes('bg-'),
                'p-4 sm:p-6': !props.stretch
            }}
            {...attributes}
        >
            {props.children}
        </div>
    )
}