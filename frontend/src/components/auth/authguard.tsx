import {Navigate, Outlet} from 'react-router-dom';
import {isAuthenticated} from '../../utils/isauthenticated.ts';

export function AuthGuard() {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
}
