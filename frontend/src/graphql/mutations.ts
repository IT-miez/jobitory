import {gql} from '@apollo/client';

export const MAKE_USER = gql(/* GraphQL */ `
    mutation makeUser(
        $email: String!
        $first_name: String!
        $last_name: String!
        $phone_number: String
        $password: String!
        $image: Upload
    ) {
        makeUser(
            user: {
                email: $email
                first_name: $first_name
                last_name: $last_name
                phone_number: $phone_number
                password: $password
                image: $image
            }
        ) {
            email
        }
    }
`);

export const LOGIN_USER = gql(/* GraphQL */ `
    mutation loginUser($email: String!, $password: String!) {
        loginUser(credentials: {email: $email, password: $password}) {
            id
            token
            message
            email
            first_name
            last_name
        }
    }
`);

export const UPDATE_USER = gql(/* GraphQL */ `
    mutation updateUser(
        $id: Int!
        $first_name: String
        $last_name: String
        $email: String
        $phone_number: String
        $address: String
        $post_code: String
        $municipality: String
    ) {
        updateUser(
            user: {
                id: $id
                first_name: $first_name
                last_name: $last_name
                email: $email
                phone_number: $phone_number
                address: $address
                post_code: $post_code
                municipality: $municipality
            }
        ) {
            message
            user {
                email
            }
        }
    }
`);
