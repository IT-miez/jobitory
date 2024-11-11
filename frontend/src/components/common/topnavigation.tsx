import {Button, TopNav} from '@topihenrik/funktia';
import {useNavigate} from 'react-router-dom';
import {useContext} from 'react';
import {ProfileModalContext} from './modalprovider.tsx';

export default function TopNavigation() {
    const navigate = useNavigate();
    const [, setIsOpen] = useContext(ProfileModalContext);

    function onLogout() {
        localStorage.clear();
        navigate('/');
    }
    const leftItems = [
        <Button key="Profile" color="primary" onPress={() => setIsOpen(true)}>
            Profile
        </Button>,
        <Button key="logout" onPress={onLogout} color={'primary'}>
            Logout
        </Button>,
    ];

    return <TopNav leftItems={leftItems} />;
}
