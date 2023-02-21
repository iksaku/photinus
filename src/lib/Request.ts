import { cache, joinPath, mergeEntries, tap, token } from "./util"

export abstract class Request<TResponse = object> {
    protected abstract method: string
    
    public readonly headers: Headers = new Headers()
    public readonly query: URLSearchParams = new URLSearchParams()
    
    protected requiresAuthorization: boolean = true
    protected _bearerToken?: string
    protected body?: BodyInit

    protected get baseEndpoint(): string {
        return '/api/v1'
    }

    protected abstract get endpoint(): string

    protected get defaultHeaders(): Headers {
        return new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })
    }

    protected get defaultQuery(): URLSearchParams {
        return new URLSearchParams()
    }

    public withBearerToken(token?: string): this {
        if (!!token) {
            this.requiresAuthorization = true
            this._bearerToken = token
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
        url.search = mergeEntries(this.defaultQuery, this.query).toString()

        const headers = mergeEntries(this.defaultHeaders, this.headers)
        
        if (this.requiresAuthorization) {
            headers.set('Authorization', `Bearer ${this._bearerToken ?? token()}`)
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