import {Button, Heading} from '@topihenrik/funktia';
import {useNavigate} from 'react-router-dom';

export function Home() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center gap-8">
            <Heading>Welcome to Jobitory!</Heading>
            <div className="flex gap-4">
                <Button color={'primary'} onPress={() => navigate('/login')}>
                    Login
                </Button>
                <Button color={'primary'} onPress={() => navigate('/signup')}>
                    Signup
                </Button>
            </div>
        </div>
    );
}
