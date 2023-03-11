import { A } from "solid-start";
import { ArrowRightOnRectangle, CogOutline, UserOutline } from "~/components/icons";
import { ArrowTopRightOnSquareOutline } from "~/components/icons/ArrowTopRightOnSquare";
import CurrencyDollar from "~/components/icons/CurrencyDollar";
import Page from "~/components/Page";
import Section from "~/components/Section";
import { cache, logout } from "~/lib/util";

export default function Settings() {
    const domain = cache.get('firefly:domain')
    const toFireFly = (path: string) => new URL(path, domain).toString()

    return (
        <Page title="Settings">
            <main class="space-y-6">
                <Section>
                    <ul class="divide-y divide-gray-200">
                        <li>
                            <A href={toFireFly('/profile')} class="flex items-center w-full hover:bg-gray-50 px-4 py-3">
                                <span class="flex items-center flex-1">
                                    <UserOutline class="w-5 h-5 mr-2" />
                                    Profile
                                </span>
                                <ArrowTopRightOnSquareOutline class="w-5 h-5" />
                            </A>
                        </li>
                        <li>
                            <A href={toFireFly('/preferences')} class="flex items-center w-full hover:bg-gray-50 px-4 py-3">
                                <span class="flex items-center flex-1">
                                    <CogOutline class="w-5 h-5 mr-2" />
                                    Preferences
                                </span>
                                <ArrowTopRightOnSquareOutline class="w-5 h-5" />
                            </A>
                        </li>
                        <li>
                            <A href={toFireFly('/currencies')} class="flex items-center w-full hover:bg-gray-50 px-4 py-3">
                                <span class="flex items-center flex-1">
                                    <CurrencyDollar class="w-5 h-5 mr-2" />
                                    Currencies
                                </span>
                                <ArrowTopRightOnSquareOutline class="w-5 h-5" />
                            </A>
                        </li>
                    </ul>
                </Section>

                <Section>
                    <button
                        type="button"
                        class="flex items-center w-full hover:bg-red-100 px-4 py-3"
                        onClick={logout}
                    >
                        <ArrowRightOnRectangle class="w-5 h-5 mr-2" />
                        <span>
                            Log out
                        </span>
                    </button>
                </Section>
            </main>
        </Page>
    )
}