import {ApolloError} from '@apollo/client';
import {ValidationErrors, ValidationError} from '@react-types/shared';
import {GraphQLFormattedError} from 'graphql/error/GraphQLError';

export interface JobitoryValidationError {
    field: string;
    message: string;
}

interface JobitoryErrorExtension {
    extensions: {
        errors: JobitoryValidationError[];
    };
}

export interface JobitoryError extends ApolloError {
    graphQLErrors: Array<Omit<GraphQLFormattedError, 'extensions'> & JobitoryErrorExtension>;
    validationErrors?: ValidationErrors;
}

export function getValidationErrors(error?: JobitoryError): ValidationErrors | undefined {
    if (error?.graphQLErrors && error.graphQLErrors[0].extensions?.errors) {
        return error.graphQLErrors.reduce<ValidationErrors>((acc, graphQLError) => {
            if (graphQLError?.extensions?.errors && Array.isArray(graphQLError.extensions.errors)) {
                graphQLError.extensions.errors.forEach(({field, message}) => {
                    acc[field] = message as ValidationError;
                });
            }
            return acc;
        }, {});
    }

    return undefined;
}
