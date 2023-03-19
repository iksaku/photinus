import { createQuery } from "@tanstack/solid-query";
import { Suspense } from "solid-js";
import { useParams } from "solid-start";
import Page, { LoadingPage } from "~/components/Page";
import { GetAccount } from "~/lib/api/v1/accounts";

export default function Account() {
    const { id } = useParams()
    const account = createQuery(() => ['accounts', 'show', id], async () => {
        return new GetAccount(id).send()
    })

    return (
        <Suspense fallback={<LoadingPage />}>
            <Page nested={true} title={account.data?.data.name ?? ''}>
                Hello!
            </Page>
        </Suspense>
    )
}