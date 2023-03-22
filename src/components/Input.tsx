import { ComponentProps, splitProps } from "solid-js"

export default function Input(_props: ComponentProps<'input'> & { id: string, label: string }) {
    const [props, attributes] = splitProps(_props, ['id', 'type', 'label', 'class'])

    return (
        <div>
            <label for={props.id}>
                {props.label}
            </label>

            <div class="mt-1">
                <input
                    id={props.id}
                    type={props.type ?? 'text'}
                    classList={{
                        [props.class ?? '']: true,
                        'block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm': true,
                    }}
                    {...attributes}
                />
            </div>
        </div>
    )
}