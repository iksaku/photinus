import { Request } from "../../Request"
import { FireFlyApiV1PaginatedResponse } from ".."
import currency from "currency.js"
import { transform, value } from "~/lib/util"

type TransactionSplitRead = {
    type: 'withdrawal'|'deposit'|'transfer'|'reconciliation'|'opening balance'
    date: string
    order: number
    currency_id: string
    currency_code: string
    currency_symbol: string
    currency_name: string
    currency_decimal_places: number
    foreign_currency_id: string|null
    foreign_currency_code: string|null
    foreign_currency_symbol: string|null
    foreign_currency_name: string|null
    foreign_currency_decimal_places: number|null
    amount: string
    foreign_amount: string|null
    description: string
    source_id: string|null
    source_name: string | null
    destination_id: string | null
    destination_name: string | null
}

type TransactionRead = {
    id: string,
    attributes: {
        user: string
        group_title: string | null
        created_at: string
        updated_at: string
        transactions: TransactionSplitRead[]
    }
}

export type TransactionSplitTransform = Omit<TransactionSplitRead, 'date'|'amount'|'foreign_amount'> & {
    date: Date
    amount: currency
    foreign_amount: currency|null
}

export type TransactionTransform = Omit<TransactionRead['attributes'], 'transactions'> & {
    id: number
    transactions: TransactionSplitTransform[]
}

export class GetAccountTransactions extends Request<FireFlyApiV1PaginatedResponse<TransactionTransform>> {
    protected method = 'GET'

    public constructor(protected account_id: number|string) {
        super()
    }
    
    protected get endpoint(): string {
        return `/accounts/${this.account_id}/transactions`
    }

    protected transform(response: FireFlyApiV1PaginatedResponse<TransactionRead>) {
        return {
            ...response,
            data: response.data
                .map((data: TransactionRead): TransactionTransform => {
                    return {
                        ...data.attributes,
                        id: parseInt(data.id),
                        transactions: data.attributes.transactions
                            .map((split: TransactionSplitRead): TransactionSplitTransform => {
                                return {
                                    ...split,
                                    date: new Date(split.date),
                                    amount: currency(split.amount, {
                                        symbol: split.currency_symbol,
                                        precision: split.currency_decimal_places,
                                    }),
                                    foreign_amount: transform(
                                        split.foreign_amount,
                                        (amount) => currency(amount, {
                                            symbol: split.foreign_currency_symbol!,
                                            precision: split.foreign_currency_decimal_places!,
                                        }),
                                        null
                                    )
                                }
                            })
                    }
                })
        }
    }
}