import {Button, Form, Heading, InlineAlert, TextField} from '@topihenrik/funktia';
import {LOGIN_USER} from '../../graphql/mutations.ts';
import {SyntheticEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useJobitoryMutation} from '../../hooks/usejobitorymutation.tsx';
import {useAuthTokenStorage, useEmailStorage, useUserIdStorage} from '../../hooks/usestorage.tsx';

export function Login() {
    const [, setStorageEmail] = useEmailStorage();
    const [, setAuthToken] = useAuthTokenStorage();
    const [, setUserId] = useUserIdStorage();
    const navigate = useNavigate();
    const [login, {error}] = useJobitoryMutation(LOGIN_USER, {
        onCompleted: (data) => {
            if (data?.loginUser?.token) {
                setAuthToken(data.loginUser.token);
                setStorageEmail(data.loginUser.email);
                setUserId(data.loginUser.id);
                navigate('/dashboard');
            }
        },
    });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        await login({
            variables: {
                email,
                password,
            },
        });
    }

    return (
        <div className="flex flex-col gap-4 w-[400px]">
            <div className="flex items-center bg-blue-600 shadow-xl rounded-xl p-8">
                <Heading level={3} className="text-white font-semibold">
                    💻 Jobitory
                </Heading>
            </div>
            <div className="flex flex-col border-2 border-solid border-gray-100 shadow-xl rounded-xl p-8">
                <div className="flex flex-col gap-4">
                    <Heading level={5}>Please login to continue</Heading>
                </div>
                <Form onSubmit={onSubmit} className="flex flex-col gap-2">
                    <TextField
                        onChange={setEmail}
                        label="Email"
                        placeholder="Email"
                        type="text"
                        name="email"
                        startIcon="Mail"
                    />
                    <TextField
                        onChange={setPassword}
                        label="Password"
                        placeholder="Password"
                        type="password"
                        name="password"
                        startIcon="KeyRound"
                    />
                    {error?.validationErrors && <InlineAlert color={'error'} message={'Invalid credentials'} />}
                    <Button type="submit" className="mt-4" color="primary">
                        Login
                    </Button>
                </Form>
            </div>
        </div>
    );
}
