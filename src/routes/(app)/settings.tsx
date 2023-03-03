import { ArrowRightOnRectangle } from "~/components/icons";
import Page from "~/components/Page";
import Section from "~/components/Section";
import { logout } from "~/lib/util";

export default function Settings() {
    return (
        <Page title="Settings">
            <Section>
                <ul class="divide-y divide-gray-200">
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