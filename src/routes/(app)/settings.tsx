import { A } from "solid-start";
import { ArrowRightOnRectangle, CogOutline, UserOutline } from "~/components/icons";
import { ArrowTopRightOnSquareOutline } from "~/components/icons/ArrowTopRightOnSquare";
import Page from "~/components/Page";
import Panel from "~/components/Panel";
import Section from "~/components/Section";
import { cache, logout } from "~/lib/util";

export default function Settings() {
    const toFireFly = (path: string) => new URL(path, cache.get('firefly:domain')).toString()

    return (
        <Page title="Settings">
            <Section>
                <ul class="divide-y divide-gray-200">
                    <li>
                        <A href={toFireFly('/profile')} class="flex items-center w-full hover:bg-gray-50 px-4 py-2">
                            <span class="flex items-center flex-1">
                                <UserOutline class="w-5 h-5 mr-2" />
                                Profile
                            </span>
                            <ArrowTopRightOnSquareOutline class="w-5 h-5" />
                        </A>
                    </li>
                    <li>
                        <A href={toFireFly('/preferences')} class="flex items-center w-full hover:bg-gray-50 px-4 py-2">
                            <span class="flex items-center flex-1">
                                <CogOutline class="w-5 h-5 mr-2" />
                                Preferences
                            </span>
                            <ArrowTopRightOnSquareOutline class="w-5 h-5" />
                        </A>
                    </li>
                    <li>
                        <button
                            type="button"
                            class="flex items-center w-full hover:bg-red-100 px-4 py-2"
                            onClick={logout}
                        >
                            <ArrowRightOnRectangle class="w-5 h-5 mr-2" />
                            <span>
                                Log out
                            </span>
                        </button>
                    </li>
                </ul>
            </Section>
        </Page>
    )
}