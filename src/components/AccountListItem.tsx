import { For } from "solid-js";
import { A } from "solid-start";
import { ChevronRightOutline } from "~/components/icons";
import { ApiResponse } from "~/lib/api/v1";
import { GetAccount } from "~/lib/api/v1/accounts";

export default function AccountListItem(props: { account: ApiResponse<GetAccount>['data'] }) {
    return (
        <A href={`/accounts/${props.account.id}`} class="block hover:bg-gray-50">
            <div class="flex items-center p-4 sm:px-6">
                <div class="flex-1">
                    <p>
                        {props.account.name}
                    </p>
                    <p class="text-sm">
                        Balance:
                        <span class="ml-1" classList={{
                            'text-green-500': props.account.current_balance.intValue > 0,
                            'text-red-500': props.account.current_balance.intValue < 0
                        }}>
                            {props.account.current_balance.format()}
                        </span>
                    </p>
                </div>
                <ChevronRightOutline class="w-5 h-5 text-gray-400" />
            </div>
        </A>
    )
}

export function AccountListPlaceholder() {
    return (
        <ul class="divide-y divide-gray-200">
            <For each={new Array(3)}>
                {(_, index) => (
                    <li class="animate-pulse opacity-75" style={{ 'animation-delay': `${500 * index()}ms` }}>
                        <div class="flex items-center p-4 sm:px-6">
                            <div class="flex-1 space-y-3">
                                <div class="w-11/12">
                                    <div class="bg-slate-600 h-4 rounded-lg">&nbsp;</div>
                                </div>
                                <div class="w-1/3">
                                    <div class="bg-slate-600 h-4 rounded-lg">&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </li>
                )}
            </For>
        </ul>
    )
}