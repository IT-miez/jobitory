import {ApolloLink, concat} from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

const uploadLink = createUploadLink({
    uri: 'http://localhost:4000/graphql',
});

const authMiddleware = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('auth_token');

    operation.setContext(({headers = {}}) => ({
        headers: {
            ...headers,
            authorization: token ? `bearer ${token}` : null,
            'Apollo-Require-Preflight': 'true',
        },
    }));

    return forward(operation);
});

export default concat(authMiddleware, uploadLink);
