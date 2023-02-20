import { useOauthCallback } from "~/lib/api/oauth";

export default function Callback() {
    const [status, requestToken] = useOauthCallback()

    requestToken()

    // TODO: Loading state
}