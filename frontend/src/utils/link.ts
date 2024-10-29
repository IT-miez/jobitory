import {ApolloLink, concat} from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import {storageKeys} from '../constants/storagekeys.ts';

const uploadLink = createUploadLink({
    uri: 'http://localhost:4000/graphql',
});

const authMiddleware = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem(storageKeys.auth_token);

    operation.setContext(({headers = {}}) => ({
        headers: {
            ...headers,
            authorization: token ? `bearer ${token}` : '',
            'Apollo-Require-Preflight': 'true',
        },
    }));

    return forward(operation);
});

export default concat(authMiddleware, uploadLink);
