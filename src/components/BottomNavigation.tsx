import { Show } from "solid-js";
import { A, useMatch } from "solid-start";
import { CogOutline, CogSolid, HomeOutline, HomeSolid } from "./icons";

export default function BottomNavigation() {
    return (
        <div class="sticky bottom-0 w-full bg-white text-black border border-t-gray-200">
            <div
                class="min-w-full h-full flex items-center justify-around"
                style={{
                    'margin-bottom': 'env(safe-area-inset-bottom)'
                }}
            >
                <HomeRoute />
                <SettingsRoute />
            </div>
        </div>
    )
}

export function NavigationIcon(props: Parameters<typeof A>[0]) {
    const { children, ...attributes } = props

    return (
        <A class="px-4 py-3" {...attributes}>
            {children}
        </A>
    )
}

export function HomeRoute() {
    const isActive = useMatch(() => "/")

    return (
        <NavigationIcon href="/">
            <Show when={isActive()} fallback={<HomeOutline class="w-6 h-6" />}>
                <HomeSolid class="w-6 h-6" />
            </Show>
        </NavigationIcon>
    )
}

export function SettingsRoute() {
    const isActive = useMatch(() => "/settings")

    return (
        <NavigationIcon href="/settings">
            <Show when={isActive()} fallback={<CogOutline class="w-6 h-6" />}>
                <CogSolid class="w-6 h-6" />
            </Show>
        </NavigationIcon>
    )
}