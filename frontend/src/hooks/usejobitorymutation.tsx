import {useMutation} from '@apollo/client';
import {MutationFunctionOptions, MutationHookOptions, MutationResult, NoInfer} from '@apollo/client/react/types/types';
import type {ApolloCache, DefaultContext, OperationVariables} from '@apollo/client/core';
import type {FetchResult} from '@apollo/client/link/core';
import type {DocumentNode} from 'graphql/index';
import type {TypedDocumentNode} from '@graphql-typed-document-node/core';
import {useMemo} from 'react';
import {getValidationErrors, JobitoryError} from '../utils/getvalidationerrors.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JobitoryMutationResult<TData = any> = Omit<MutationResult<TData>, 'error'> & {
    error?: JobitoryError;
};

export type JobitoryMutationTuple<
    TData,
    TVariables,
    TContext = DefaultContext,
    TCache extends ApolloCache<any> = ApolloCache<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
> = [
    mutate: (options?: MutationFunctionOptions<TData, TVariables, TContext, TCache>) => Promise<FetchResult<TData>>,
    result: JobitoryMutationResult<TData>,
];

export function useJobitoryMutation<
    TData = any, // eslint-disable-line @typescript-eslint/no-explicit-any
    TVariables = OperationVariables,
    TContext = DefaultContext,
    TCache extends ApolloCache<any> = ApolloCache<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
>(
    mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
    options?: MutationHookOptions<NoInfer<TData>, NoInfer<TVariables>, TContext, TCache>
): JobitoryMutationTuple<TData, TVariables, TContext, TCache> {
    const [mutate, result] = useMutation(mutation, options);
    const validationErrors = useMemo(() => getValidationErrors(result.error as JobitoryError), [result.error]);
    return [
        mutate,
        {
            ...result,
            error: result.error
                ? {
                      ...(result.error as JobitoryError),
                      validationErrors: validationErrors,
                  }
                : undefined,
        },
    ];
}
