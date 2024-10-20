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

    type Query {
        accountData(id: String): User,
        profileData(email: String): User,
        experiencesData(email: String): [ExperienceData!]!,
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

    input ExperienceInput {
        company_name: String!
        position: String!
        city: String!
        from: String
        to: String
        additional_information: String!
    }
    
    type  ExperienceOutput {
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
        city:String
        degree:String
        subject: String
        from: String
        to: String
        additional_information: String
    }
    
    type  EducationOutput {
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
        updateUser(input: UpdateUserInput!): UpdateUserResponse,
        createExperience(input: ExperienceInput): ExperienceOutput,
        deleteExperience(experience_id: Int!):deleteResult,
        createEducation(input: Education!): EducationOutput,
        deleteEducation(education_id: Int!):deleteResult,
    }
`;

export default typeDefs;
