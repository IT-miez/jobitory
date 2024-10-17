import SideNavigation from './sidenavigation.tsx';
import TopNavigation from './topnavigation.tsx';
import {Outlet} from 'react-router-dom';

export function AppLayout() {
    return (
        <div className="flex h-screen w-screen">
            <SideNavigation />
            <div className="flex flex-col w-full">
                <TopNavigation />
                <main className="flex flex-col justify-center items-center h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
