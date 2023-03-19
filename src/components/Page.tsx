import { ParentProps, Show } from "solid-js";
import { ArrowLeftMini, ArrowSmallLeftMini, ArrowSmallLeftOutline, ChevronLeftMini } from "./icons";
import Spinner from "./Spinner";

export default function Page(props: ParentProps<{ title: string, nested?: boolean }>) {
    return (
        <main class="space-y-6">
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
                <h1 class="text-3xl font-medium">
                    {props.title}
                </h1>
            </div>

            <div>
                {props.children}
            </div>
        </main>
    )
}

export function LoadingPage() {
    return (
        <main class="min-h-screen flex flex-col items-center justify-center space-y-6 p-4">
            <Spinner class="w-10 h-10" />
        </main>
    )
}