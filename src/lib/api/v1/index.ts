export type FireFlyApiV1Response<Data = Record<string, any>> = {
    data: Data
}

export type FireFlyApiV1PaginatedResponse<Data = Record<string, any>> = {
    data: Data[]
    meta: {
        pagination: {
            total: number
            count: number
            per_page: number
            current_page: number
            total_pages: number
        }
    }
}