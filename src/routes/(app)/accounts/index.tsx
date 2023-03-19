import { createQuery } from "@tanstack/solid-query";
import { For, Show, Suspense } from "solid-js";
import Page from "~/components/Page";
import Tabs from "~/components/Tabs";
import AccountListItem, { AccountListPlaceholder } from "~/components/AccountListItem";
import { GetAccountList } from "~/lib/api/v1/accounts";
import { CreditCardOutline } from "~/components/icons";
import EmptyState from "~/components/EmptyState";

function queryAccountsByType(type: string) {
    // TODO: Paginated query
    // TODO: Pagination scrolls to top of section
    return createQuery(() => ['accounts.index', type], async () => {
        return await new GetAccountList()
            .withQueryParameters({ type })
            .send()
    })
}

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
                id="accountType"
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
    const accounts = queryAccountsByType(props.type)

    return (
        <Suspense fallback={<AccountListPlaceholder />}>
            <Show when={(accounts.data?.data.length ?? 0) > 0} fallback={<EmptyAccountList />}>
                <ul class="divide-y divide-gray-200">
                    <For each={accounts.data?.data}>
                        {(account) => (
                            <li>
                                <AccountListItem account={account} />
                            </li>
                        )}
                    </For>
                </ul>
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
