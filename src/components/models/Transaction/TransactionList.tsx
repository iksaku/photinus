import { ComponentProps, For, Match, Show, splitProps, Switch } from "solid-js";
import { TransactionSplitTransform, TransactionTransform } from "~/lib/api/v1/accounts";
import { ArrowLeftOutline, ArrowRightOutline, ArrowsRightLeftOutline } from "../../icons";

export function TransactionListItem(_props: ComponentProps<'li'> & { transaction: TransactionTransform }) {
    const [props, attributes] = splitProps(_props, ['transaction', 'class'])

    const isSplit = () => props.transaction.transactions.length > 1
    const type = () => props.transaction.transactions[0].type

    return (
        <li
            classList={{
                [props.class ?? '']: true,
                'contain-paint': true,
                '!border !border-red-200': isSplit() && type() === 'withdrawal',
                '!border !border-green-200': isSplit() && type() === 'deposit',
                '!border !border-blue-200': isSplit() && type() === 'transfer',
            }}
            {...attributes}
        >
            <div class="block hover:bg-gray-50">
                <Show when={isSplit()}>
                    <p class="text-center font-medium px-4 pt-2 sm:px-6">
                        {props.transaction.group_title}
                    </p>
                </Show>

                <div classList={{ 'divide-y divide-dashed divide-gray-200': isSplit() }}>
                    <For each={props.transaction.transactions}>
                        {(split) => <TransactionSplitListItem split={split} />}
                    </For>
                </div>
            </div>
        </li>
    )
}

function TransactionSplitListItem(props: { split: TransactionSplitTransform }) {
    return (
        <div class="flex items-center px-4 py-2 first:pt-2 last:pb-4 only:py-4 sm:px-6 space-x-4">
            <div
                classList={{
                    'p-2 rounded-lg': true,
                    'bg-red-100 text-red-700': props.split.type === 'withdrawal',
                    'bg-green-100 text-green-700': props.split.type === 'deposit',
                    'bg-blue-100 text-blue-700': props.split.type === 'transfer',
                }}
            >
                <Switch>
                    <Match when={props.split.type === 'withdrawal'}>
                        <ArrowLeftOutline class="w-6 h-6" />
                    </Match>
                    <Match when={props.split.type === 'deposit'}>
                        <ArrowRightOutline class="w-6 h-6" />
                    </Match>
                    <Match when={props.split.type === 'transfer'}>
                        <ArrowsRightLeftOutline class="w-6 h-6" />
                    </Match>
                </Switch>
            </div>

            <div class="min-w-0 grow">
                <p class="truncate">
                    {props.split.description}
                </p>
                <div class="text-sm">
                    <p class="truncate">
                        {props.split.source_name}
                        <br />
                        &#10551; {props.split.destination_name}
                    </p>
                    <p class="text-gray-500">
                        {props.split.date.toDateString()}
                    </p>
                </div>
            </div>

            <p
                classList={{
                    'text-left text-sm sm:text-base font-medium': true,
                    'text-red-700': props.split.type === 'withdrawal',
                    'text-green-700': props.split.type === 'deposit',
                    'text-blue-700': props.split.type === 'transfer',
                }}
            >
                {props.split.amount.format()}
            </p>
        </div>
    )
}

export function TransactionListPlaceholder(props: { count?: number }) {
    return (
        <ul class="divide-y divide-gray-200">
            <For each={new Array(props.count ?? 3)}>
                {(_, index) => (
                    <li class="animate-pulse opacity-75" style={{ 'animation-delay': `${500 * index()}ms` }}>
                        <div class="flex items-center p-4 sm:px-6 space-x-4">
                            <div class="bg-slate-600 p-2 rounded-lg">
                                <div class="w-6 h-6"></div>
                            </div>

                            <div class="min-w-0 w-full space-y-1">
                                <div class="w-11/12 h-4 bg-slate-600 rounded-lg">&nbsp;</div>
                                <div class="space-y-1">
                                    <div class="w-7/12 h-2 bg-slate-600 rounded-lg">&nbsp;</div>
                                    <div class="w-7/12 h-2 bg-slate-600 rounded-lg ml-4">&nbsp;</div>
                                    <div class="w-8/12 h-2 bg-slate-600 rounded-lg">&nbsp;</div>
                                </div>
                            </div>

                            <div class="w-1/2 h-6 bg-slate-600 rounded-lg"></div>
                        </div>
                    </li>
                )}
            </For>
        </ul>
    )
}