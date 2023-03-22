import { createInfiniteQuery } from "@tanstack/solid-query";
import { For, Show, Suspense } from "solid-js";
import Page from "~/components/Page";
import Tabs from "~/components/Tabs";
import AccountListItem, { AccountListPlaceholder } from "~/components/models/Account";
import { GetAccountList } from "~/lib/api/v1/accounts";
import { CreditCardOutline } from "~/components/icons";
import EmptyState from "~/components/EmptyState";
import { createIntersectionObserver } from "@solid-primitives/intersection-observer";
import { getNextPageParam } from "~/lib/api/v1";

const accountTypes = {
    asset: 'Assets',
    expense: 'Expenses',
    revenue: 'Revenue',
    liability: 'Liabilities'
}

export default function Accounts() {
    return (
        <Page title="Accounts">
            <Tabs.Panel
                id="account-type"
                param="type"
                tabs={accountTypes}
                default="asset"
            >
                <For each={Object.entries(accountTypes)}>
                    {([value, name]) => (
                        <Tabs.Content for={value}>
                            <AccountsByType label={name} type={value} />
                        </Tabs.Content>
                    )}
                </For>
            </Tabs.Panel>
        </Page>
    )
}

function AccountsByType(props: { label: string, type: string }) {
    const accounts = createInfiniteQuery({
        queryKey: () => ['accounts', 'index', props.type],
        queryFn: ({ pageParam = 1 }) => new GetAccountList()
            .withQueryParameters({
                page: pageParam,
                type: props.type,
            })
            .send(),
        getNextPageParam
    })

    const hasData = () => accounts.data?.pages.some((page) => page.data.length > 0) ?? false

    const loadMore = (el: Element) => {
        createIntersectionObserver(() => [el], ([entry]) => {
            if (!entry.isIntersecting) return
            
            if (accounts.isLoading || accounts.isFetchingNextPage) return

            if (!accounts.hasNextPage) return

            accounts.fetchNextPage()
        })
    }

    return (
        <Suspense fallback={<AccountListPlaceholder />}>
            <Show when={hasData()} fallback={<EmptyAccountList />}>
                <ul class="divide-y divide-gray-200">
                    <For each={accounts.data?.pages}>
                        {(page) => (
                            <For each={page.data}>
                                {(account) => <AccountListItem account={account} />}
                            </For>
                        )}
                    </For>

                    <Show when={accounts.isFetchingNextPage}>
                        <AccountListPlaceholder />
                    </Show>
                </ul>

                <div ref={loadMore}></div>
            </Show>
        </Suspense>
    )
}

function EmptyAccountList() {
    return (
        <EmptyState
            icon={<CreditCardOutline />}
            title="No accounts"
            class="p-4"
        />
    )
}
