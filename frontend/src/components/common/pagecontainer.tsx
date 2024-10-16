import {ReactElement} from 'react';

interface PageContainerProps {
    children: ReactElement | null;
}

export function PageContainer({children}: PageContainerProps) {
    return <main className="flex flex-col justify-center items-center h-screen">{children}</main>;
}
