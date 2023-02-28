import { accessToken, cache, joinPath, tap } from "./util"

function mergeIterables<T extends { [Symbol.iterator](): IterableIterator<[string, any]> }>(
    callback: (result: Record<string, any>) => T,
    ...entries: T[]
): T {
    return callback(
        entries.reduce(
            (carry, next) => ({
                ...carry,
                ...Object.fromEntries(next)
            }),
            {}
        )
    )
}

const mergeQueryParams = (...stores: URLSearchParams[]) => mergeIterables((result) => new URLSearchParams(result), ...stores)
const mergeHeaders = (...stores: Headers[]) => mergeIterables((result) => new Headers(result), ...stores)

export abstract class Request<TResponse = object> {
    protected abstract method: string
    
    protected headers: Headers = new Headers()
    protected query: URLSearchParams = new URLSearchParams()
    
    protected requiresAuthorization: boolean = true
    protected bearerToken?: string
    protected body?: BodyInit

    protected get baseEndpoint(): string {
        return '/api/v1'
    }

    protected abstract get endpoint(): string

    protected get defaultHeaders(): Headers {
        return new Headers({
            'Accept': 'application/json',
        })
    }

    protected get defaultQuery(): URLSearchParams {
        return new URLSearchParams()
    }

    public withHeaders(headers: Record<string, string>|Headers): this {
        if (!(headers instanceof Headers)) {
            headers = new Headers(headers)
        }

        this.headers = mergeHeaders(this.headers, headers)

        return this
    }

    public withQueryParameters(params: Record<string, any>|URLSearchParams): this {
        if (!(params instanceof URLSearchParams)) {
            params = new URLSearchParams(params)
        }

        this.query = mergeQueryParams(this.query, (params as URLSearchParams))

        return this
    }

    public withBearerToken(token?: string): this {
        if (!!token) {
            this.requiresAuthorization = true
            this.bearerToken = token
        }

        return this
    }

    public withBody(body: BodyInit | Record<string, any>): this {
        if (!(body instanceof FormData) && typeof body === 'object') {
            this.headers.set('Content-Type', 'application/json')
            body = JSON.stringify(body)
        }

        this.body = body

        return this
    }

    public withFormData(form: Record<string, any>|FormData): this {
        if (!(form instanceof FormData)) {
            if (typeof form !== 'object') {
                throw `Unable to convert [${typeof form}] to [FormData]`
            }

            form = tap(new FormData(), (formData) => {
                // @ts-ignore
                for (const [key, value] of Object.entries(form)) {
                    formData.set(key, value)
                }
            })
        }

        return this.withBody(form)
    }

    public async send(): Promise<TResponse> {
        const url = new URL(joinPath(this.baseEndpoint, this.endpoint), cache.get('firefly:domain'))
        url.search = mergeQueryParams(this.defaultQuery, this.query).toString()

        const headers = mergeHeaders(this.defaultHeaders, this.headers)
        
        if (this.requiresAuthorization) {
            headers.set('Authorization', `Bearer ${this.bearerToken ?? accessToken()}`)
        }

        if (this.body instanceof FormData) {
            // Really weird fix so browser automatically sets content type
            // to multipart/form-data along with boundary.
            headers.delete('Content-Type')
        }

        const response = await fetch(url, {
            method: this.method,
            headers,
            body: this.body,
        })

        const data = await response.json()

        if (!response.ok) {
            throw {
                ...data,
                response
            }
        }

        return data
    }
}