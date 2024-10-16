import {ApolloLink, concat, HttpLink} from '@apollo/client';

const httpLink = new HttpLink({uri: 'http://localhost:4000/graphql'});

const authMiddleware = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('auth_token');

    operation.setContext(({headers = {}}) => ({
        headers: {
            ...headers,
            authorization: token ? `bearer ${token}` : null,
        },
    }));

    return forward(operation);
});

export default concat(authMiddleware, httpLink);
