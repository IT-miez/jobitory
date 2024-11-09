const config = {
    overwrite: true,
    schema: './src/typedefs.ts',
    generates: {
        './src/generated/graphql.ts': {
            plugins: ['typescript', 'typescript-resolvers', 'typescript-validation-schema'],
        },
    },
    config: {
        strictScalars: 'true',
        scalars: {
            ID: 'string',
            Upload: (Promise),
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
