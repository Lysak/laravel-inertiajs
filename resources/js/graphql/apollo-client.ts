import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { resolveCsrfToken } from '@/graphql/csrf'

const httpLink = new HttpLink({
    uri: '/graphql',
    credentials: 'same-origin',
})

const csrfLink = setContext((_, context) => {
    const csrfToken = resolveCsrfToken()

    return {
        headers: {
            ...context.headers,
            'X-Requested-With': 'XMLHttpRequest',
            ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
        },
    }
})

export const apolloClient = new ApolloClient({
    link: ApolloLink.from([csrfLink, httpLink]),
    cache: new InMemoryCache({
        typePolicies: {
            Category: {
                keyFields: ['id'],
            },
            Drink: {
                keyFields: ['id'],
            },
            Order: {
                keyFields: ['id'],
            },
            OrderItem: {
                keyFields: ['id'],
            },
            User: {
                keyFields: ['id'],
            },
        },
    }),
})
