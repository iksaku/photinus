import { Request } from "~/lib/Request"
import { FireFlyApiV1PaginatedResponse, FireFlyApiV1Response } from "."

type CategoryData = {
    category_id: string
    currency_code: string
    currency_symbol: string
    currency_decimal_places: number
    sum: string
}

type CategoryRead = {
    id: string
    type: string
    attributes: {
        name: string
        notes: string|null
        spent: CategoryData[]
        earned: CategoryData[]
    }
}

export class ListCategories extends Request<FireFlyApiV1PaginatedResponse<CategoryRead>> {
    protected method = 'GET'

    protected get endpoint(): string {
        return '/categories'
    }
}

export class GetCategory extends Request<FireFlyApiV1Response<CategoryRead>> {
    protected method = 'GET'

    public constructor(protected category_id: number|string) {
        super()
    }

    protected get endpoint(): string {
        return `/categories/${this.category_id}`
    }
}