import { ComponentProps, ParentProps, Show, splitProps } from "solid-js";
import { ArrowLeftMini } from "./icons";
import Spinner from "./Spinner";

export default function Page(_props: ParentProps<ComponentProps<'div'> & { title?: string, nested?: boolean }>) {
    const [props, attributes] = splitProps(_props, ['title', 'nested', 'children'])

    return (
        <main class="grow flex flex-col space-y-6">
            <Show when={!!props.title || !!props.nested}>
                <div class="space-y-1">
                    <Show when={props.nested ?? false}>
                        <button
                            type="button"
                            class="inline-flex items-center justify-start"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeftMini class="w-5 h-5 mr-1" />
                            <span>Go back</span>
                        </button>
                    </Show>
                    <Show when={!!props.title}>
                        <h1 class="text-3xl font-medium">
                            {props.title}
                        </h1>
                    </Show>
                </div>
            </Show>

            <div {...attributes}>
                {props.children}
            </div>
        </main>
    )
}

export function LoadingPage(props: { fullPage?: boolean }) {
    return (
        <main
            class="flex flex-col items-center justify-center space-y-6"
            classList={{
                'grow': !props.fullPage,
                'min-h-screen': !!props.fullPage
            }}
        >
            <Spinner class="w-10 h-10" />
        </main>
    )
}