import { logout, user } from "~/lib/util";
import { AuthenticatedMiddleware } from "~/lib/util/auth/middleware";

export default function Home() {
  return (
    <AuthenticatedMiddleware>
      <main>
        <h1>Home</h1>
        <p>Welcome back {user()?.email}!</p>

        <button onClick={() => logout()}>Logout</button>
      </main>
    </AuthenticatedMiddleware>
  );
}