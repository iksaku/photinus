import { For, Suspense } from "solid-js";
import { createRouteData, useRouteData } from "solid-start";
import { GetAccount } from "~/lib/api/accounts";
import { GetPreference } from "~/lib/api/preferences";
import { formatNumber, logout, user } from "~/lib/util";
import { AuthenticatedMiddleware } from "~/lib/util/auth/middleware";

export function routeData() {
  return createRouteData(async () => {
    const preference = await new GetPreference<number[]>('frontPageAccounts').send()

    const accounts = preference.data.attributes.data.map((account) => new GetAccount(account).send())

    return await Promise.all(accounts)
  }, { key: 'accounts' })
}

export default function Home() {
  const accounts = useRouteData<typeof routeData>()

  return (
    <AuthenticatedMiddleware>
      <main>
        <div>
          <h1>Home</h1>
          <p>Welcome back {user()?.email}!</p>

          <button onClick={() => logout()}>Logout</button>
        </div>

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
      </main>
    </AuthenticatedMiddleware>
  );
}