// @refresh reload
import { Show, Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import './root.css'
import { InitializeAuthentication } from "./lib/util/auth/middleware";
import { useRegisterSW } from "virtual:pwa-register/solid";
import { pwaInfo } from "virtual:pwa-info"

export default function Root() {
  useRegisterSW({ immediate: true })

  return (
    <Html lang="en" class="scroll-smooth">
      <Head>
        <Title>Photinus</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <Meta name="description" content="A FireFly III Client" />
        <Show when={!!pwaInfo?.webManifest.href}>
          <Link rel="manifest" href={pwaInfo!.webManifest.href} />
        </Show>
      </Head>
      <Body class="bg-gray-200">
        <Suspense>
          <ErrorBoundary>
            <InitializeAuthentication>
              <Routes>
                <FileRoutes />
              </Routes>
            </InitializeAuthentication>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}