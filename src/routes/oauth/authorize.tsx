import { useOauthAuthorize } from "~/lib/api/oauth";
import { Show } from "solid-js";

export default function Authorize() {
    const [status, { Form }] = useOauthAuthorize()

    return (
        <main>
            <h1>Authorize</h1>
            <Form>
                <label for="domain">Domain</label>
                <input id="domain" name="domain" type="text" />
                <Show when={!!status.error?.domain}>
                    <span>{status.error.domain._errors[0]}</span>
                </Show>

                <label for="client_id">Client ID</label>
                <input id="client_id" name="clientId" type="text" />
                <Show when={!!status.error?.clientId}>
                    <span>{status.error.clientId._errors[0]}</span>
                </Show>

                <button type="submit">
                    Submit
                </button>
            </Form>
        </main>
    )
}