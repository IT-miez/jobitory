import {Button, TopNav} from '@topihenrik/funktia';
import {useNavigate} from 'react-router-dom';

export default function TopNavigation() {
    const navigate = useNavigate();

    function onLogout() {
        localStorage.clear();
        navigate('/');
    }
    const leftItems = [
        <Button key="account" color="primary">
            Account
        </Button>,
        <Button key="logout" onPress={onLogout} color={'primary'}>
            Logout
        </Button>,
    ];

    return <TopNav leftItems={leftItems} />;
}
