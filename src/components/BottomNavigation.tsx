import { JSX, Show, splitProps } from "solid-js";
import { A, useMatch } from "solid-start";
import { CogOutline, CogSolid, CreditCardOutline, CreditCardSolid, HomeOutline, HomeSolid } from "./icons";

export default function BottomNavigation() {
    return (
        <div class="sticky bottom-0 w-full bg-white text-black border border-t-gray-200">
            <div
                class="min-w-full h-full flex items-center justify-around"
                style={{
                    'margin-bottom': 'env(safe-area-inset-bottom)'
                }}
            >
                <NavigationIcon href="/" isActive={useMatch(() => '/')} fallback={<HomeOutline class="w-6 h-6" />}>
                    <HomeSolid class="w-6 h-6" />
                </NavigationIcon>

                <NavigationIcon href="/accounts" isActive={useMatch(() => '/accounts/*')} fallback={<CreditCardOutline class="w-6 h-6" />}>
                    <CreditCardSolid class="w-6 h-6" />
                </NavigationIcon>
                
                <NavigationIcon href="/settings" isActive={useMatch(() => '/settings')} fallback={<CogOutline class="w-6 h-6" />}>
                    <CogSolid class="w-6 h-6" />
                </NavigationIcon>
            </div>
        </div>
    )
}

function NavigationIcon(_props: Parameters<typeof A>[0] & { isActive: ReturnType<typeof useMatch>, fallback: JSX.Element }) {
    const [props, attributes] = splitProps(_props, ['isActive', 'fallback', 'children'])

    return (
        <A
            class="px-4 py-3"
            classList={{
                'border-t-2 border-blue-500': !!props.isActive()
            }}
            {...attributes}
        >
            <Show when={props.isActive()} fallback={props.fallback}>
                {props.children}
            </Show>
        </A>
    )
}
