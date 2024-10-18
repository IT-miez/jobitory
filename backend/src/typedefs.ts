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
        image_url: String
    }
    
    type deleteResult {
        message: String
    }

    type ValidLogin {
        token: String!
        message: String!
        email: String!
        first_name: String!
        last_name: String!
    }

    type Query {
        accountData(id: String): User,
        profileData(email: String): User,
    }

    input UpdateUserInput {
        email: String
        first_name: String
        last_name: String
        phone_number: String
        address: String
        post_code: String
        municipality: String
        image: Upload
    }
    
    type UpdateUserResponse {
        message: String
        user: User
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
            image: Upload
        ): User
        loginUser(email: String!, password: String!): ValidLogin,
        deleteUser(email: String!):deleteResult,
        updateUser(input: UpdateUserInput!): UpdateUserResponse
    }
`;

export default typeDefs;
