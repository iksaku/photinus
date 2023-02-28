import { For, Suspense } from "solid-js";
import { createRouteData, Outlet, useRouteData } from "solid-start";
import { GetAccount } from "~/lib/api/v1/accounts";
import { GetCategory, ListCategories } from "~/lib/api/v1/categories";
import { GetPreference } from "~/lib/api/v1/preferences";
import { firstDayOfMonth, formatNumber, lastDayOfMonth, logout, toLaravelDate, user } from "~/lib/util";
import { AuthenticatedMiddleware } from "~/lib/util/auth/middleware";

export function routeData() {
  const accounts = createRouteData(async () => {
    const response = await new GetPreference<number[]>('frontPageAccounts').send()

    const accounts = response.data.attributes.data.map((account) => new GetAccount(account).send())

    return await Promise.all(accounts)
  }, { key: 'accounts' })

  const categories = createRouteData(async () => {
    const now = new Date()

    const response = await new ListCategories()
      .withQueryParameters({
        start: toLaravelDate(firstDayOfMonth(now)),
        end: toLaravelDate(lastDayOfMonth(now))
      })
      .send()

    return response.data
      .map((category) => {
        return {
          name: category.attributes.name,
          spent: formatNumber(category.attributes.spent[0]?.sum ?? '0.00'),
          earned: formatNumber(category.attributes.earned[0]?.sum ?? '0.00'),
        }
      })
  }, { key: 'categories' })

  return { accounts, categories }
}

export default function Home() {
  const { accounts, categories } = useRouteData<typeof routeData>()

  return (
    <>
      <div>
        <h1>Home</h1>
        <p>Welcome back {user()?.email}!</p>

        <button onClick={() => logout()}>Logout</button>
      </div>

      <Suspense fallback={<p>🗃️ Loading categories...</p>}>
        <ul>
          <For each={categories()}>
            {(category) => (
              <li>{category.name} (Earned: {category.earned} | Spent: {category.spent})</li>
            )}
          </For>
        </ul>
      </Suspense>

      <Suspense fallback={<p>🏦 Loading accounts...</p>}>
        <ul>
          <For each={accounts()}>
            {(account) => (
              <li>
                {account.data.attributes.name} ({formatNumber(account.data.attributes.current_balance)})
              </li>
            )}
          </For>
        </ul>
      </Suspense>
    </>
  );
}