import { ComponentProps, splitProps } from "solid-js"

export default function Input(_props: ComponentProps<'input'> & { id: string, label: string }) {
    const [props, attributes] = splitProps(_props, ['id', 'type', 'label'])

    return (
        <div>
            <label for={props.id}>
                {props.label}
            </label>

            <div class="mt-1">
                <input
                    id={props.id}
                    type={props.type ?? 'text'}
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    {...attributes}
                />
            </div>
        </div>
    )
}