import { createIntersectionObserver } from "@solid-primitives/intersection-observer";
import { createInfiniteQuery, createQuery } from "@tanstack/solid-query";
import { For, Show, Suspense } from "solid-js";
import { Title, useParams } from "solid-start";
import { HttpStatusCode } from "solid-start/server";
import EmptyState from "~/components/EmptyState";
import { CreditCardOutline } from "~/components/icons";
import { TransactionListItem, TransactionListPlaceholder } from "~/components/models/Transaction";
import Page, { LoadingPage } from "~/components/Page";
import Panel from "~/components/Panel";
import { getNextPageParam } from "~/lib/api/v1";
import { GetAccount, GetAccountTransactions } from "~/lib/api/v1/accounts";

export default function Account() {
    const { id } = useParams()
    
    const account = createQuery(() => ['accounts', 'show', id], () => new GetAccount(id).send(), {
        retry: false
    })
    
    const transactions = createInfiniteQuery({
        queryKey: () => ['accounts', 'show', id, 'transactions'],
        queryFn: ({ pageParam = 1 }) => new GetAccountTransactions(id)
            .withQueryParameters({
                page: pageParam,
                // start: '2023-03-01',
                // end: '2023-03-31',
            })
            .send(),
        getNextPageParam,
        get enabled() {
            return !!account.data
        }
    })

    const hasTransactions = () => transactions.data?.pages.some((page) => page.data.length > 0) ?? false

    const loadMore = (el: Element) => {
        createIntersectionObserver(() => [el], ([ entry ]) => {
            if (!entry.isIntersecting) return

            if (transactions.isLoading || transactions.isFetchingNextPage) return

            if (!transactions.hasNextPage) return

            transactions.fetchNextPage()
        })
    }

    return (
        <Suspense fallback={<LoadingPage />}>
            <Show when={!!account.data} fallback={<AccountNotFound />}>
                <Title>
                    {account.data!.data.name}
                </Title>

                <Page nested={true} title={account.data!.data.name}>
                    <Panel stretch={true}>
                        <Suspense fallback={<TransactionListPlaceholder />}>
                            <Show when={hasTransactions()} fallback={<EmptyTransactionList />}>
                                <ul class="divide-y divide-gray-200">
                                    <For each={transactions.data!.pages}>
                                        {(page) => (
                                            <For each={page.data}>
                                                {(transaction) => (
                                                    <TransactionListItem
                                                        transaction={transaction}
                                                        class="first:rounded-t-lg last:rounded-b-lg"
                                                    />
                                                )}
                                            </For>
                                        )}
                                    </For>

                                    <Show when={transactions.isFetchingNextPage}>
                                        <li>
                                            Loading...
                                        </li>
                                    </Show>
                                </ul>

                                <div ref={loadMore}></div>
                            </Show>
                        </Suspense>
                    </Panel>
                </Page>
            </Show>
        </Suspense>
    )
}

function AccountNotFound() {
    return (
        <Page nested={true} class="grow flex items-center justify-center">
            <HttpStatusCode code={404} />
            <EmptyState
                icon={<CreditCardOutline />}
                title="Account not found"
            />
        </Page>
    )
}

function EmptyTransactionList() {
    return (
        <EmptyState
            title="No transactions"
            class="p-4"
        />
    )
}