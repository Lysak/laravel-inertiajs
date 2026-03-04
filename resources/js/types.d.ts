import type {
    AuthenticatedPageProps as AuthenticatedPagePropsShape,
    AppUser as AppUserShape,
} from '@/types/inertia'

declare global {
    interface AppUser extends AppUserShape {}

    interface AppPageProps extends AuthenticatedPagePropsShape {}

    interface ZiggyRoute {
        (): {
            current: (...args: unknown[]) => boolean
        }
        (...args: unknown[]): string
        current: (...args: unknown[]) => boolean
    }

    const route: ZiggyRoute;
}
