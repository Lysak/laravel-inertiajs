import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

const normalizeModuleId = (id: string): string => id.replaceAll('\\', '/');

export default defineConfig({
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {
                            name: 'inertia',
                            test: (id: string) => {
                                const moduleId = normalizeModuleId(id);

                                return (
                                    moduleId.includes('/node_modules/') &&
                                    moduleId.includes('@inertiajs/react')
                                );
                            },
                        },
                        {
                            name: 'apollo',
                            test: (id: string) => {
                                const moduleId = normalizeModuleId(id);

                                return (
                                    moduleId.includes('/node_modules/') &&
                                    (moduleId.includes('@apollo/client') ||
                                        moduleId.includes('/graphql/'))
                                );
                            },
                        },
                    ],
                },
            },
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
});
