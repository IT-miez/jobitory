import {GraphQLErrorOptions} from 'graphql/error/GraphQLError';
import {ApolloServerErrorCode} from '@apollo/server/errors';
import {GraphQLError} from 'graphql';

export function createSingleError(message: string, field: string | number) {
    return {
        message: message,
        field: field,
    };
}

export interface JobitoryError {
    field: string | number;
    message: string;
}

export class GraphQLJobitoryError extends GraphQLError {
    constructor(
        rootMessage: string,
        errors: JobitoryError | JobitoryError[],
        code: ApolloServerErrorCode,
        options?: GraphQLErrorOptions
    ) {
        super(rootMessage, {
            ...options,
            extensions: {
                ...(options?.extensions ?? {}),
                code,
                errors: Array.isArray(errors) ? errors : [createSingleError(errors.message, errors.field)],
            },
        });
    }
}

export class GraphQLZodError extends GraphQLJobitoryError {
    constructor(errors: JobitoryError[], options?: GraphQLErrorOptions) {
        super('Invalid arguments', errors, ApolloServerErrorCode.BAD_USER_INPUT, options);
    }
}

export class GraphQLInternalServerError extends GraphQLJobitoryError {
    constructor(message: string, field: string, options?: GraphQLErrorOptions) {
        super('Internal server error', {message, field}, ApolloServerErrorCode.INTERNAL_SERVER_ERROR, options);
    }
}

export class GraphQLInvalidArgsError extends GraphQLJobitoryError {
    constructor(message: string, field: string, options?: GraphQLErrorOptions) {
        super('Invalid arguments', {message, field}, ApolloServerErrorCode.BAD_USER_INPUT, options);
    }
}
