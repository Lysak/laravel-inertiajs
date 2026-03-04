import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: './resources/graphql/schema.graphql',
    documents: ['resources/js/graphql/documents/**/*.graphql'],
    ignoreNoDocuments: true,
    generates: {
        './resources/js/graphql/generated/': {
            preset: 'client',
            config: {
                gqlTagName: 'graphql',
                useTypeImports: true,
                scalars: {
                    ID: {
                        input: 'string | number',
                        output: 'string',
                    },
                },
            },
        },
    },
};

export default config;
