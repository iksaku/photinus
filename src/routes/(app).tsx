import { Outlet } from "solid-start";
import { AuthenticatedMiddleware } from "~/lib/util/auth/middleware";
import BottomNavigation from "~/components/BottomNavigation"

export default function AppLayout() {
    return (
        <AuthenticatedMiddleware>
            <div class="relative min-h-screen flex flex-col justify-between">
                <div class="grow w-full flex flex-col p-4">
                    <Outlet />
                </div>

                <BottomNavigation />
            </div>
        </AuthenticatedMiddleware>
    )
}