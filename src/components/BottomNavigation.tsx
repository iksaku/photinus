import { Accessor, JSX, Show } from "solid-js";
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

function NavigationIcon(props: Parameters<typeof A>[0] & { isActive: ReturnType<typeof useMatch>, fallback: JSX.Element }) {
    const { isActive, fallback, children, ...attributes } = props

    return (
        <A
            class="px-4 py-3"
            classList={{
                'border-t-2 border-blue-500': !!isActive()
            }}
            {...attributes}
        >
            <Show when={isActive()} fallback={fallback}>
                {children}
            </Show>
        </A>
    )
}

function HomeRoute() {
    return (
        <NavigationIcon href="/" isActive={useMatch(() => '/')} fallback={<HomeOutline class="w-6 h-6" />}>
            <HomeSolid class="w-6 h-6" />
        </NavigationIcon>
    )
}

function SettingsRoute() {
    return (
        <NavigationIcon href="/settings" isActive={useMatch(() => '/settings')} fallback={<CogOutline class="w-6 h-6" />}>
            <CogSolid class="w-6 h-6" />
        </NavigationIcon>
    )
}