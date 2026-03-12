export type GraphQLValidationMessages = Record<string, string[]>

type GraphQLErrorPayload = {
    message?: string
    extensions?: {
        validation?: GraphQLValidationMessages
    }
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

export function getGraphQLErrors(error: unknown): GraphQLErrorPayload[] {
    if (!isObject(error)) {
        return []
    }

    if (Array.isArray(error.graphQLErrors)) {
        return error.graphQLErrors as GraphQLErrorPayload[]
    }

    if (Array.isArray(error.errors)) {
        return error.errors as GraphQLErrorPayload[]
    }

    return []
}

export function getGraphQLValidationMessages(
    error: unknown,
): GraphQLValidationMessages | undefined {
    return getGraphQLErrors(error)
        .map((graphQLError) => graphQLError.extensions?.validation)
        .find((validation): validation is GraphQLValidationMessages => validation !== undefined)
}

export function getGraphQLSubmissionMessage(error: unknown): string | undefined {
    const message = getGraphQLErrors(error)[0]?.message

    if (!message || message === 'validation') {
        return undefined
    }

    return message
}
