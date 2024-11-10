import {Button, Form, Heading, TextField} from '@topihenrik/funktia';
import {LOGIN_USER} from '../../graphql/mutations.ts';
import {SyntheticEvent, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {storageKeys} from '../../constants/storagekeys.ts';
import {useJobitoryMutation} from '../../hooks/usejobitorymutation.tsx';

export function Login() {
    const navigate = useNavigate();
    const [login, {error}] = useJobitoryMutation(LOGIN_USER, {
        onCompleted: (data) => {
            if (data?.loginUser?.token) {
                localStorage.setItem(storageKeys.auth_token, data.loginUser.token);

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

    const validationErrors = useMemo(
        () => (error?.validationErrors ? {password: 'Invalid credentials', email: ' '} : undefined),
        [error?.validationErrors]
    );

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
                <Form validationErrors={validationErrors} onSubmit={onSubmit} className="flex flex-col gap-2">
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
                    <Button type="submit" className="mt-4" color="primary">
                        Login
                    </Button>
                </Form>
            </div>
        </div>
    );
}
