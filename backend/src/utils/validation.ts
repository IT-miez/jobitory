import {ZodIssue} from 'zod/lib/ZodError';
import {LoginUserInput, LoginUserInputSchema, NewUserInput, NewUserInputSchema} from '../generated/graphql.js';
import {JobitoryError} from './error.js';
import {GraphQLZodError} from './error.js';
import {z} from 'zod';

function parseIssues(issues: ZodIssue[]): JobitoryError[] {
    return issues.map((issue) => ({
        message: issue.message,
        field: issue.path[0],
    }));
}

type Properties<T> = Required<{
    [K in keyof T]: z.ZodType<T[K], any, T[K]>; // eslint-disable-line @typescript-eslint/no-explicit-any
}>;

export async function validateResolverArgs<T>(schema: () => z.ZodObject<Properties<T>>, args: T) {
    const validationResult = schema().safeParse(args);
    if (!validationResult.success) {
        const issues = parseIssues(validationResult.error.errors);
        if (issues.length > 0) {
            throw new GraphQLZodError(issues);
        }
    }
}

export async function validateMakeUser(user?: NewUserInput) {
    await validateResolverArgs(NewUserInputSchema, user);
}

export async function validateLoginUser(credentials?: LoginUserInput) {
    await validateResolverArgs(LoginUserInputSchema, credentials);
}
