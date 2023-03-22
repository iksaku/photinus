import { createQuery } from "@tanstack/solid-query";
import { For, ParentProps, Show, Suspense } from "solid-js";
import { A } from "solid-start";
import { ChevronRightOutline } from "~/components/icons";
import Page from "~/components/Page";
import AccountListItem, { AccountListPlaceholder } from "~/components/models/Account";
import Section from "~/components/Section";
import { GetAccount } from "~/lib/api/v1/accounts";
import { GetPreference } from "~/lib/api/v1/preferences";
import { GetBasicSummary } from "~/lib/api/v1/summary";

export default function Home() {
  const accounts = createQuery({
    queryKey: () => ['home', 'accounts'],
    queryFn: async () => {
      const response = await new GetPreference<number[]>('frontPageAccounts').send()

      const accounts = response.data.attributes.data.map((account) => new GetAccount(account).send())

      return (await Promise.all(accounts))
        .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
    }
  })

  // const categories = createQuery(() => ['home', 'categories'], async () => {
  //   const now = new Date()

  //   return await new GetCategoryList()
  //     .withQueryParameters({
  //       start: toLaravelDate(firstDayOfMonth(now)),
  //       end: toLaravelDate(lastDayOfMonth(now))
  //     })
  //     .send()
  // })

  // const summary = createQuery({
  //   queryKey: () => ['home', 'summary'],
  //   queryFn: () => new GetBasicSummary()
  //     .withQueryParameters({
  //       start: '2023-03-01',
  //       end: '2023-03-31',
  //     })
  //     .send()
  // })

  return (
    <Page title="Home">
      <div class="space-y-6">
        <Section label="Accounts">
          <Suspense fallback={<AccountListPlaceholder />}>
            <ul class="divide-y divide-gray-200">
              <For each={accounts.data}>
                {(account) => <AccountListItem account={account.data} />}
              </For>
            </ul>
          </Suspense>
        </Section>
      </div>
    </Page>
  );
}