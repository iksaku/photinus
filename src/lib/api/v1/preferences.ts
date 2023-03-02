import { Request } from "~/lib/api/Request"
import { FireFlyApiV1PaginatedResponse, FireFlyApiV1Response } from ".";

type PreferenceRead<PreferenceData> = {
    id: string
    type: string
    attributes: {
        name: string
        data: PreferenceData
    }
}

export class ListPreferences<PreferenceData = any> extends Request<FireFlyApiV1PaginatedResponse<PreferenceRead<PreferenceData>>> {
    protected method = 'GET'

    protected get endpoint(): string {
        return '/preferences'
    }
}

export class GetPreference<PreferenceData = any> extends Request<FireFlyApiV1Response<PreferenceRead<PreferenceData>>> {
    protected method = 'GET'

    public constructor(protected preference: string) {
        super()
    }

    protected get endpoint(): string {
        return `/preferences/${this.preference}`
    }
}