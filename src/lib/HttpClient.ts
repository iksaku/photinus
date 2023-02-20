import { normalizeUrl, tap } from "./util"
import type { URLInit, URLSearchParamsInit } from "./util"

export class HttpClient {
    public headers: Headers = new Headers()
    protected _asForm: boolean = false

    protected static async normalizeResponse(response: Response) {
        const data = await response.json()

        if (!response.ok) {
            throw data
        }

        return data
    }

    public withHeaders(headers: HeadersInit): HttpClient {
        headers = new Headers(headers)

        for (const [key, value] of headers.entries()) {
            this.headers.set(key, value)
        }

        return this
    }

    public asForm(): HttpClient {
        this._asForm = true

        return this
    }

    public async get(url: URLInit, params?: URLSearchParamsInit) {
        return await HttpClient.normalizeResponse(
            await fetch(
                normalizeUrl(url, params),
                { headers: this.headers }
            )
        )
    }

    public async post(url: URLInit, body?: Record<string, any>|FormData) {
        this.headers.set('Accept', 'application/json')

        if (!!body && !(body instanceof FormData)) {
            if (this._asForm) {
                body = tap(new FormData(), (form) => {
                    // @ts-ignore
                    for (const [key, value] of Object.entries(body)) {
                        form.set(key, value)
                    }
                })
            } else {
                this.headers.set('Content-Type', 'application/json')
                // @ts-ignore
                body = JSON.stringify(body)
            }
        }

        return await HttpClient.normalizeResponse(
            await fetch(
                normalizeUrl(url),
                {
                    method: 'POST',
                    headers: this.headers,
                    // @ts-ignore
                    body
                }
            )
        )
    }
}