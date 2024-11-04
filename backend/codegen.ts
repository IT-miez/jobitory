import type {CodegenConfig} from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: './src/typedefs.ts',
    generates: {
        './src/generated/graphql.ts': {
            plugins: ['typescript', 'typescript-resolvers', 'typescript-validation-schema'],
        },
    },
    config: {
        contextType: '../index#AuthContext',
        strictScalars: 'true',
        scalars: {
            ID: 'string',
            Upload: 'any',
        },
        schema: 'zod',
        directives: {
            constraint: {
                minLength: 'min',
                maxLength: 'max',
                format: {
                    email: 'email',
                },
            },
        },
    },
};

export default config;
