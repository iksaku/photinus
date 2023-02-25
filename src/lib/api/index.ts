export type FireFlyApiV1Response<Data = Record<string, any>> = {
    data: Data
}

export type FireFlyApiV1PaginatedResponse<Data = Record<string, any>> = {
    data: Data[]
    pagination: {
        total: number
        count: number
        per_page: number
        current_page: number
        total_pages: number
    }
    links: {
        self: string
        first: string
        last: string
    }
}