import {SideNav, SideNavItem} from '@topihenrik/funktia';

export default function SideNavigation() {
    const initialItems: SideNavItem[] = [
        {
            text: 'Dashboard',
            icon: 'LayoutDashboard',
            route: '/dashboard',
        },
        {
            text: 'CV editor',
            icon: 'FileUser',
            route: '/cv-editor',
        },
        {
            text: 'Job applications',
            icon: 'Briefcase',
            route: '/job-applications',
        },
    ];

    const items = initialItems.map((item) => {
        return {
            ...item,
            isActive: window.location.pathname.includes(item.route),
        };
    });

    return <SideNav title="Jobitory" items={items} />;
}
