import { A } from "solid-start";
import { HomeOutline } from "./icons";

export default function BottomNavigation() {
    // TOOD: Bottom navigation (Investigate CSS safe area)

    return (
        <div class="sticky bottom-0 w-full bg-white">
            <div class="min-w-full h-full flex items-center justify-around">
                <NavigationIcon href="/">
                    <HomeOutline class="w-6 h-6" />
                </NavigationIcon>
                <NavigationIcon href="/">
                    <HomeOutline class="w-6 h-6" />
                </NavigationIcon>
                <NavigationIcon href="/">
                    <HomeOutline class="w-6 h-6" />
                </NavigationIcon>
                <NavigationIcon href="/">
                    <HomeOutline class="w-6 h-6" />
                </NavigationIcon>
            </div>
        </div>
    )
}

export function NavigationIcon(props: Parameters<typeof A>[0]) {
    const { children, ...attributes } = props

    return (
        <A class="p-6" {...attributes}>
            {children}
        </A>
    )
}