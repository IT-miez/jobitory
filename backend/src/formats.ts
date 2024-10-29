import {GraphQLError} from 'graphql';

const formats = {
    'phone-number': (value) => {
        if (value.length > 5 || value.length == 0) {
            return true;
        } else {
            throw new GraphQLError('Phone number must be longer than 5 digits');
        }
    },
    address: (value) => {
        if (value.length > 5 || value.length == 0) {
            return true;
        } else {
            throw new GraphQLError('Address must be longer than 5 digits');
        }
    },
    post_code: (value) => {
        if (value.length > 3 || value.length == 0) {
            return true;
        } else {
            throw new GraphQLError('Post code must be longer than 3 letters');
        }
    },
    municipality: (value) => {
        if (value.length > 3 || value.length == 0) {
            return true;
        } else {
            throw new GraphQLError('Municipality must be longer than 3 letters');
        }
    },
};

export default formats;
