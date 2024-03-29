import { Request } from "../Request"

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

export type ApiResponse<TRequest extends Request> = Awaited<ReturnType<TRequest['send']>>

export function getNextPageParam(lastPage: FireFlyApiV1PaginatedResponse) {
    const total = lastPage.meta.pagination.total_pages
    const current = lastPage.meta.pagination.current_page

    return current < total
        ? current + 1
        : undefined
}