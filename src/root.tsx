// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import { initializeToken } from "./lib/util/authUtils";
import { middlewareElement } from "./lib/util/Middleware";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart + AuthJS</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <InitializeAuth>
              <Routes>
                <FileRoutes />
              </Routes>
            </InitializeAuth>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}

const InitializeAuth = middlewareElement(async () => {
  await initializeToken()
})