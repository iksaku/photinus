import { ComponentProps, ParentProps } from "solid-js"

type Props = ParentProps<ComponentProps<"input">> & {
    id: string
    type: string
    label: string
}

export default function Input(props: Props) {
    const { id, type = "text", label, ...attributes } = props

    return (
        <div>
            <label for={id}>
                {label}
            </label>

            <div class="mt-1">
                <input
                    id={id}
                    type="text"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    {...attributes}
                />
            </div>
        </div>
    )
}