const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type User {
    email: String!
    name: String!
    phone_number: String!
    address: String!
    post_code: String!
    municipality: String!
  }

  type ValidLogin {
    token: String!
    message: String!
  }

  type Mutation {
    makeUser (
    email: String!
    name: String!
    phone_number: String!
    address: String!
    post_code: String!
    municipality: String!
    password: String!
  ): User
  
  }

  type Mutation {
    loginUser (
    email: String!
    password: String!
  ): ValidLogin
  
  }
  type Query {
    accountData (
        id: String
    ): User
  }
`;

export default typeDefs