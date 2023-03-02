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
import { InitializeAuthentication } from "./lib/util/auth/middleware";
import './root.css'

export default function Root() {
  return (
    <Html lang="en" class="scroll-smooth">
      <Head>
        <Title>SolidStart + AuthJS</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
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