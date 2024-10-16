const typeDefs = /* GraphQL */ `
    #graphql
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    scalar Upload

    type User {
        email: String!
        first_name: String!
        last_name: String!
        phone_number: String
        address: String
        post_code: String
        municipality: String
        image: Upload
    }

    type ValidLogin {
        token: String!
        message: String!
    }

    type Query {
        accountData(id: String): User
    }

    type Mutation {
        makeUser(
            email: String!
            first_name: String!
            last_name: String!
            phone_number: String
            address: String
            post_code: String
            municipality: String
            password: String!
            image: String
        ): User
        loginUser(email: String!, password: String!): ValidLogin
    }
`;

export default typeDefs;
