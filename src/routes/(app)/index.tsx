import { For, Show, Suspense } from "solid-js";
import { A, createRouteData, useRouteData } from "solid-start";
import { ChevronRight } from "~/components/icons";
import Page from "~/components/Page";
import Section from "~/components/Section";
import { GetAccount } from "~/lib/api/v1/accounts";
import { ListCategories } from "~/lib/api/v1/categories";
import { GetPreference } from "~/lib/api/v1/preferences";
import { firstDayOfMonth, lastDayOfMonth, toLaravelDate } from "~/lib/util";

export function routeData() {
  const accounts = createRouteData(async () => {
    const response = await new GetPreference<number[]>('frontPageAccounts').send()

    const accounts = response.data.attributes.data.map((account) => new GetAccount(account).send())
    
    return (await Promise.all(accounts))
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  }, { key: 'accounts' })

  const categories = createRouteData(async () => {
    const now = new Date()

    return await new ListCategories()
      .withQueryParameters({
        start: toLaravelDate(firstDayOfMonth(now)),
        end: toLaravelDate(lastDayOfMonth(now))
      })
      .send()
  }, { key: 'categories' })

  return { accounts, categories }
}

export default function Home() {
  const { accounts, categories } = useRouteData<typeof routeData>()

  return (
    <Page title="Home">
      <div class="space-y-6">
        <Section label="Accounts">
          <Suspense fallback={<SectionListPlaceholder />}>
            <ul class="divide-y divide-gray-200">
              <For each={accounts()}>
                {(account) => (
                  <li>
                    <A href="#" class="block hover:bg-gray-50">
                      <div class="flex items-center p-4 sm:px-6">
                        <div class="flex-1">
                          <p>
                            {account.data.name}
                          </p>
                          <p class="text-sm">
                            Balance:
                            <span class="ml-1" classList={{
                              'text-green-500': account.data.current_balance.intValue > 0,
                              'text-red-500': account.data.current_balance.intValue < 0
                            }}>
                              {account.data.current_balance.format()}
                            </span>
                          </p>
                        </div>
                        <ChevronRight class="w-5 h-5 text-gray-400" />
                      </div>
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </Suspense>
        </Section>

        <Section label="Categories">
          <Suspense fallback={<SectionListPlaceholder />}>
            <ul class="divide-y divide-gray-200">
              <For each={categories()?.data}>
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
                        <ChevronRight class="w-5 h-5 text-gray-400" />
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