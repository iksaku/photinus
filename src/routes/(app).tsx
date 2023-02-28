import { Outlet } from "solid-start";
import { AuthenticatedMiddleware } from "~/lib/util/auth/middleware";

export default function AppLayout() {
    return (
        <AuthenticatedMiddleware>
            <main>
                <h1>This is App Layout</h1>
                <Outlet />
            </main>
        </AuthenticatedMiddleware>
    )
}