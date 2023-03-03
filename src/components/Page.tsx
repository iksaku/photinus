import { ParentProps } from "solid-js";

export default function Page(props: ParentProps<{ title: string }>) {
    return (
        <main>
            <h1 class="text-3xl font-medium mb-6">
                {props.title}
            </h1>

            {props.children}
        </main>
    )
}

// TODO: Nested page template with Back button