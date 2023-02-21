import { Request } from "../Request";

type UserInformationResponse = {
    data: {
        id: string
        attributes: {
            email: string
        }
    }
}

export class GetUserInformation extends Request<UserInformationResponse> {
    protected method = 'GET'

    protected get endpoint(): string {
        return '/about/user'
    }
}