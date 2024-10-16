import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Login} from './components/auth/login.tsx';
import {PageContainer} from './components/common/pagecontainer.tsx';
import {SignUp} from './components/auth/signup.tsx';
import {Home} from './components/home/home.tsx';
import {Dashboard} from './components/dashboard/dashboard.tsx';
import {ApolloClient, ApolloProvider} from '@apollo/client';
import cache from './utils/cache.ts';
import link from './utils/link.ts';
import {AppLayout} from './components/common/applayout.tsx';
import {AuthGuard} from './components/auth/authguard.tsx';
import {CVEditor} from './components/editor/cveditor.tsx';
import {JobApplications} from './components/jobs/jobapplications.tsx';

const client = new ApolloClient({
    cache: cache,
    link: link,
});

function Router() {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<PageContainer />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Route>
                    <Route path="/" element={<AuthGuard />}>
                        <Route path="/" element={<AppLayout />}>
                            <Route path={'/dashboard'} element={<Dashboard />} />
                            <Route path={'/cv-editor'} element={<CVEditor />} />
                            <Route path={'/job-applications'} element={<JobApplications />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ApolloProvider>
    );
}

export default Router;
