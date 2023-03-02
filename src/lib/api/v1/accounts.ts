import currency from "currency.js"
import { Request } from "~/lib/api/Request"
import { FireFlyApiV1PaginatedResponse, FireFlyApiV1Response } from "."

type AccountRead = {
    id: string
    attributes: {
        name: string
        type: 'asset' | 'expense' | 'import' | 'revenue' | 'cash' | 'liability' | 'liabilities' | 'initial-balance' | 'reconciliation'
        active: boolean
        order: number|null
        account_rule: 'defaultAsset'|'sharedAsset'|'savingAsset'|'ccAsset'|'cashWalletAsset'
        currency_id: number
        currency_code: string
        currency_symbol: string
        currency_decimal_places: number
        current_balance: string
        current_balance_date: string
        opening_balance: string
        current_debt: string
        virtual_balance: string
        include_net_worth: boolean
    }
}

type AccountTransform = Omit<AccountRead['attributes'], 'current_balance' | 'virtual_balance'> & {
    id: number
    current_balance: currency
    virtual_balance: currency
}

function transform(data: AccountRead): AccountTransform {
    const options: currency.Options = {
        symbol: data.attributes.currency_symbol,
        precision: data.attributes.currency_decimal_places,
    }

    return {
        ...data.attributes,
        id: parseInt(data.id),
        current_balance: currency(data.attributes.current_balance, options),
        virtual_balance: currency(data.attributes.virtual_balance, options)
    }
}

export class ListAccounts extends Request<FireFlyApiV1PaginatedResponse<AccountTransform>> {
    protected method = 'GET'

    protected get endpoint(): string {
        return '/accounts'
    }

    protected transform(response: FireFlyApiV1PaginatedResponse<AccountRead>) {
        return {
            ...response,
            data: response.data
                .map(transform)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        }
    }
}

export class GetAccount extends Request<FireFlyApiV1Response<AccountTransform>> {
    protected method = 'GET'

    public constructor(protected account_id: number|string) {
        super()
    }

    protected get endpoint(): string {
        return `/accounts/${this.account_id}`
    }

    protected transform(response: FireFlyApiV1Response<AccountRead>) {
        return {
            ...response,
            data: transform(response.data)
        }
    }
}