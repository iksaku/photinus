import { FireFlyApiV1PaginatedResponse, FireFlyApiV1Response } from "."
import { Request } from "../Request"

type AccountRead = {
    id: string
    type: string
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

export class ListAccounts extends Request<FireFlyApiV1PaginatedResponse<AccountRead>> {
    protected method = 'GET'

    protected get endpoint(): string {
        return '/accounts'
    }
}

export class GetAccount extends Request<FireFlyApiV1Response<AccountRead>> {
    protected method = 'GET'

    public constructor(protected account_id: number|string) {
        super()
    }

    protected get endpoint(): string {
        return `/accounts/${this.account_id}`
    }
}