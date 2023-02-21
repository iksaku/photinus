import { ZodError } from "zod";

export function zodErrorToLaravelFormat(error: ZodError) {
    const messageBag = new Map<string, string[]>()
    for (const [, issue] of error.issues.entries()) {
        const name = issue.path.join('')

        const errors = messageBag.get(name) ?? []
        errors.push(issue.message)

        messageBag.set(name, errors)
    }

    return {
        message: 'The given data was invalid.',
        errors: Object.fromEntries(messageBag.entries())
    }
}