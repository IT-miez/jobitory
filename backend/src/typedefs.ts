import gql from 'graphql-tag';

const typeDefs = /* GraphQL */ gql`
    #graphql
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    directive @constraint(
        minLength: Int
        maxLength: Int
        format: String
        message: String
    ) on INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION

    scalar Upload

    type DeleteResult {
        message: String
    }

    type ValidLogin {
        id: Int!
        token: String!
        message: String!
        email: String!
        first_name: String!
        last_name: String!
    }

    type Experience {
        id: Int!
        company_name: String!
        position: String!
        city: String!
        from: String!
        to: String
        additional_information: String!
    }

    type ExperienceData {
        company_name: String
        position: String
        city: String
        from: String
        to: String
        additional_Information: String
    }

    input UpdateUserInput {
        id: Int!
        email: String
        first_name: String
        last_name: String
        phone_number: String
        address: String
        post_code: String
        municipality: String
        image: Upload
    }

    input ExperienceInput {
        company_name: String!
        position: String!
        city: String!
        from: String
        to: String
        additional_information: String!
    }

    type ExperienceOutput {
        company_name: String!
        position: String!
        city: String!
        from: String
        to: String
        additional_information: String!
    }

    input Education {
        id: Int!
        school_name: String
        city: String
        degree: String
        subject: String
        from: String
        to: String
        additional_information: String
    }

    type EducationOutput {
        school_name: String!
        city: String!
        degree: String!
        subject: String!
        from: String
        to: String
        additional_information: String!
    }

    type UpdateUserResponse {
        message: String
        user: User
    }

    type User {
        id: Int!
        email: String!
        first_name: String!
        last_name: String!
        phone_number: String
        address: String
        post_code: String
        municipality: String
        image_url: String
    }

    input NewUserInput {
        email: String! @constraint(minLength: 3, maxLength: 64, format: "email")
        first_name: String! @constraint(minLength: 2, maxLength: 64)
        last_name: String! @constraint(minLength: 2, maxLength: 64)
        phone_number: String @constraint(minLength: 3, maxLength: 64)
        address: String @constraint(minLength: 3, maxLength: 64)
        post_code: String @constraint(minLength: 3, maxLength: 64)
        municipality: String @constraint(minLength: 3, maxLength: 64)
        password: String! @constraint(minLength: 3, maxLength: 64)
        image: Upload
    }

    input LoginUserInput {
        email: String! @constraint(minLength: 3, format: "email")
        password: String! @constraint(minLength: 3)
    }

    type Query {
        accountData(id: Int): User
        profileData(id: Int): User
        experiencesData(email: String): [ExperienceData!]!
        educationsData(email: String): [EducationOutput!]!
    }

    type Mutation {
        makeUser(user: NewUserInput): User
        loginUser(credentials: LoginUserInput): ValidLogin
        deleteUser(email: String!): DeleteResult
        updateUser(user: UpdateUserInput!): UpdateUserResponse
        createExperience(input: ExperienceInput): ExperienceOutput
        deleteExperience(experience_id: Int!): DeleteResult
        createEducation(input: Education!): EducationOutput
        deleteEducation(education_id: Int!): DeleteResult
        deleteImage: DeleteResult
    }
`;

export default typeDefs;
