import { lazy } from "solid-js"

export const middlewareElement = (callback: () => void | PromiseLike<void>) => lazy(async () => {
    await callback()

    return {
        default: (props) => (<>{props.children}</>)
    }
})