import { Outlet } from "solid-start";
import { GuestMiddleware } from "~/lib/util/auth/middleware";

export default function LoginLayout() {
    return (
        <GuestMiddleware>
            <Outlet />
        </GuestMiddleware>
    )
}