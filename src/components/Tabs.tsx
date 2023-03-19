import { Accessor, createContext, For, ParentProps, Show, useContext } from "solid-js"
import { useLocation, useNavigate } from "solid-start"
import BasePanel from "./Panel"

const TabsContext = createContext<Accessor<string>>()
function useTabsContext() {
    return useContext(TabsContext)
}

function Panel(props: ParentProps<{ id: string, tabs: Record<string, string>, default: string }>) {
    const navigate = useNavigate()
    const navigateToTab = (tab: string) => navigate(`#${tab}`, {
        scroll: true
    })

    const activeTab = () => {
        let currentTab = useLocation().hash.replace(/^#/, '')

        if (currentTab.length < 1) {
            currentTab = props.default
        }

        return currentTab
    }

    return (
        <TabsContext.Provider value={activeTab}>
            <BasePanel stretch={true}>
                <div class="relative">
                    <div class="sm:hidden bg-white sticky top-0 inset-x-0 p-4 border-b border-gray-200">
                        <label
                            for={`tabs.${props.id}.mobile`}
                            class="sr-only"
                        >
                            Select a tab
                        </label>
                        <select
                            id={`tabs.${props.id}.mobile`}
                            class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            value={activeTab()}
                            onChange={(e) => navigateToTab(e.currentTarget.value)}
                        >
                            <For each={Object.entries(props.tabs)}>
                                {([value, name]) => (
                                    <option value={value}>
                                        {name}
                                    </option>
                                )}
                            </For>
                        </select>
                    </div>
                    <div class="hidden sm:block bg-white sticky top-0 inset-x-0">
                        <div class="border-b border-gray-200 pt-4 px-6">
                            <nav class="-mb-px flex space-x-8" aria-label={`tabs.${props.id}`}>
                                <For each={Object.entries(props.tabs)}>
                                    {([value, name]) => (
                                        <button
                                            class="whitespace-nowrap pb-2 border-b-2 text-sm font-medium"
                                            classList={{
                                                'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700': activeTab() !== value,
                                                'border-indigo-500 text-indigo-600': activeTab() === value,
                                            }}
                                            onClick={() => navigateToTab(value)}
                                            aria-selected={activeTab() === value}
                                        >
                                            {name}
                                        </button>
                                    )}
                                </For>
                            </nav>
                        </div>
                    </div>

                    <div>
                        {props.children}
                    </div>
                </div>
            </BasePanel>
        </TabsContext.Provider>
    )
}

function Content(props: ParentProps<{ for: string }>) {
    const activeTab = useTabsContext()!

    return (
        <Show when={activeTab() === props.for}>
            {props.children}
        </Show>
    )
}

export default {
    Panel,
    Content
}