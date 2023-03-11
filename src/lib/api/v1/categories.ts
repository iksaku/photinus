import currency from "currency.js"
import { Request } from "~/lib/api/Request"
import { FireFlyApiV1PaginatedResponse, FireFlyApiV1Response } from "."

type CategoryCalculation = {
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
        spent: CategoryCalculation[]
        earned: CategoryCalculation[]
    }
}

type CategoryTransform = Omit<CategoryRead['attributes'], 'spent'|'earned'> & {
    id: number
    name: string
    notes: string|null
    spent: currency | null
    earned: currency | null
}

function transform(data: CategoryRead): CategoryTransform {
    const toCurrency = (entries: CategoryCalculation[]): currency|null => {
        if (entries.length < 1) {
            return null
        }

        const entry = entries[0]

        return currency(entry.sum, {
            symbol: entry.currency_symbol,
            precision: entry.currency_decimal_places
        })
    }

    return {
        id: parseInt(data.id),
        name: data.attributes.name,
        notes: data.attributes.notes,
        spent: toCurrency(data.attributes.spent),
        earned: toCurrency(data.attributes.earned),
    }
}

export class GetCategoryList extends Request<FireFlyApiV1PaginatedResponse<CategoryTransform>> {
    protected method = 'GET'

    protected get endpoint(): string {
        return '/categories'
    }

    protected transform(response: FireFlyApiV1PaginatedResponse<CategoryRead>) {
        return {
            ...response,
            data: response.data.map(transform)
        }
    }
}

export class GetCategory extends Request<FireFlyApiV1Response<CategoryTransform>> {
    protected method = 'GET'

    public constructor(protected category_id: number|string) {
        super()
    }

    protected get endpoint(): string {
        return `/categories/${this.category_id}`
    }

    protected transform(response: FireFlyApiV1Response<CategoryRead>) {
        return {
            ...response,
            data: transform(response.data)
        }
    }
}