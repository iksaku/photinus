import { createQuery } from "@tanstack/solid-query";
import { For, ParentProps, Show, Suspense } from "solid-js";
import { A } from "solid-start";
import { ChevronRightOutline } from "~/components/icons";
import Page from "~/components/Page";
import AccountListItem, { AccountListPlaceholder } from "~/components/AccountListItem";
import Section from "~/components/Section";
import { GetAccount } from "~/lib/api/v1/accounts";
import { GetCategoryList } from "~/lib/api/v1/categories";
import { GetPreference } from "~/lib/api/v1/preferences";
import { firstDayOfMonth, lastDayOfMonth, toLaravelDate } from "~/lib/util";

export default function Home() {
  const accounts = createQuery(() => ['home.accounts'], async () => {
    const response = await new GetPreference<number[]>('frontPageAccounts').send()

    const accounts = response.data.attributes.data.map((account) => new GetAccount(account).send())

    return (await Promise.all(accounts))
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  })

  const categories = createQuery(() => ['categories.index'], async () => {
    const now = new Date()

    return await new GetCategoryList()
      .withQueryParameters({
        start: toLaravelDate(firstDayOfMonth(now)),
        end: toLaravelDate(lastDayOfMonth(now))
      })
      .send()
  })

  return (
    <Page title="Home">
      <div class="space-y-6">
        <Section label="Accounts">
          <Suspense fallback={<AccountListPlaceholder />}>
            <ul class="divide-y divide-gray-200">
              <For each={accounts.data}>
                {(account) => (
                  <li>
                    <AccountListItem account={account.data} />
                  </li>
                )}
              </For>
            </ul>
          </Suspense>
        </Section>

        <Section label="Categories">
          <Suspense fallback={<SectionListPlaceholder />}>
            <ul class="divide-y divide-gray-200">
              <For each={categories.data?.data}>
                {(category) => (
                  <li>
                    <A href="#" class="block hover:bg-gray-50">
                      <div class="flex items-center p-4 sm:px-6">
                        <div class="flex-1">
                          <p>
                            {category.name}
                          </p>
                          <p class="text-sm">
                            Earned:
                            <Show when={!!category.earned} fallback={<span class="ml-1 italic">No data</span>}>
                              <span class="ml-1 text-green-500">
                                {category.earned!.format()}
                              </span>
                            </Show>
                          </p>
                          <p class="text-sm">
                            Spent:
                            <Show when={!!category.spent} fallback={<span class="ml-1 italic">No data</span>}>
                              <span class="ml-1 text-red-500">
                                {category.spent!.format()}
                              </span>
                            </Show>
                          </p>
                        </div>
                        <ChevronRightOutline class="w-5 h-5 text-gray-400" />
                      </div>
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </Suspense>
        </Section>
      </div>
    </Page>
  );
}

function SectionListPlaceholder() {
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