import {Outlet} from 'react-router-dom';

export function PageContainer() {
    return (
        <main className="flex flex-col justify-center items-center h-screen">
            <Outlet />
        </main>
    );
}
