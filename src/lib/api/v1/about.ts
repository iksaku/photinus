import { Request } from "~/lib/Request"
import { FireFlyApiV1Response } from "."

type UserRead = {
    id: string
    type: string
    attributes: {
        email: string
        blocked: boolean
        blocked_code: string|null
    }
}

export class GetUserInformation extends Request<FireFlyApiV1Response<UserRead>> {
    protected method = 'GET'

    protected get endpoint(): string {
        return '/about/user'
    }
}