import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Login} from './components/auth/login.tsx';
import {PageContainer} from './components/common/pagecontainer.tsx';
import {SignUp} from './components/auth/signup.tsx';
import {Home} from './components/home/home.tsx';
import {Dashboard} from './components/dashboard/dashboard.tsx';
import {ApolloClient, ApolloProvider} from '@apollo/client';
import cache from './utils/cache.ts';
import link from './utils/link.ts';

const client = new ApolloClient({
    cache: cache,
    link: link,
});

function Router() {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <PageContainer>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path={'/dashboard'} element={<Dashboard />} />
                    </Routes>
                </PageContainer>
            </BrowserRouter>
        </ApolloProvider>
    );
}

export default Router;
