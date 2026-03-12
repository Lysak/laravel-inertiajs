import type axios from 'axios';

declare global {
    interface AppUser {
        id?: number;
        name: string;
        email: string;
        email_verified_at?: string | null;
        [key: string]: unknown;
    }

    interface AppPageProps {
        auth: {
            user: AppUser;
        };
        [key: string]: unknown;
    }

    interface ZiggyRoute {
        (): {
            current: (...args: unknown[]) => boolean;
        };
        (...args: unknown[]): string;
        current: (...args: unknown[]) => boolean;
    }

    const route: ZiggyRoute;

    interface Window {
        axios: typeof axios;
    }
}
