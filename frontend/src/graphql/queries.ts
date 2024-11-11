import {gql} from '@apollo/client';

export const PROFILE_DATA = gql(/* GraphQL */ `
    query profileData($id: Int!) {
        profileData(id: $id) {
            email
            first_name
            last_name
            phone_number
            address
            post_code
            municipality
            image_url
        }
    }
`);
