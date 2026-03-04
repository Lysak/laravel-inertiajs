import '../css/app.css'
import { ApolloProvider } from '@apollo/client/react'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'
import { apolloClient } from '@/graphql/apollo-client'

const appName = import.meta.env.VITE_APP_NAME || 'Coffee Shop'

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el)

        root.render(
            <ApolloProvider client={apolloClient}>
                <App {...props} />
            </ApolloProvider>,
        )
    },
    progress: {
        color: '#4B5563',
    },
})
