import { Request } from "~/lib/api/Request"
import { FireFlyApiV1Response } from "."

type UserRead = {
    id: string
    type: string
    attributes: {
        email: string
        blocked: boolean
        blocked_code: string|null
        role: string|null
    }
}

type UserTransform = {
    id: number
    email: string
    blocked: boolean
    blocked_code: string|null
    is_admin: boolean
}

export class GetUserInformation extends Request<FireFlyApiV1Response<UserTransform>> {
    protected method = 'GET'

    protected get endpoint(): string {
        return '/about/user'
    }

    protected transform(response: FireFlyApiV1Response<UserRead>) {
        return {
            ...response,
            data: {
                id: parseInt(response.data.id),
                email: response.data.attributes.email,
                blocked: response.data.attributes.blocked,
                blocked_code: response.data.attributes.blocked_code,
                is_admin: response.data.attributes.role === 'owner'
            } satisfies UserTransform
        }
    }
}