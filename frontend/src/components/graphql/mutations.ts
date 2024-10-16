import {gql} from '@apollo/client';

export const MAKE_USER = gql(/* GraphQL */ `
    mutation makeUser(
        $email: String!
        $first_name: String!
        $last_name: String!
        $phone_number: String!
        $password: String!
    ) {
        makeUser(
            email: $email
            first_name: $first_name
            last_name: $last_name
            phone_number: $phone_number
            password: $password
        ) {
            email
        }
    }
`);

export const LOGIN_USER = gql(/* GraphQL */ `
    mutation loginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
            token
            message
        }
    }
`);
