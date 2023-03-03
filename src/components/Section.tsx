import { ParentProps, Show } from "solid-js";
import Panel from "./Panel";

export default function Section(props: ParentProps<{ label?: string }>) {
    return (
        <div class="space-y-1">
            <Show when={!!props.label}>
                <p class="text-gray-800 text-lg font-medium">
                    {props.label}
                </p>
            </Show>
            <Panel stretch={true}>
                {props.children}
            </Panel>
        </div>
    )
}