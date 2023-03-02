import { Request } from "./Request";

type OauthTokenResponse = {
    access_token: string
    refresh_token: string
}

export class GetOauthToken extends Request<OauthTokenResponse> {
    protected method = 'POST'
    protected requiresAuthorization = false

    protected get baseEndpoint(): string {
        return '/oauth'
    }

    protected get endpoint(): string {
        return '/token'
    }
}