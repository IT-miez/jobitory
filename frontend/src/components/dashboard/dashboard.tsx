import {Button} from '@topihenrik/funktia';
import {useNavigate} from 'react-router-dom';

export function Dashboard() {
    const navigate = useNavigate();

    function onLogout() {
        localStorage.clear();
        navigate('/');
    }

    return (
        <div>
            <Button onPress={onLogout} color={'primary'}>
                Logout
            </Button>
        </div>
    );
}
