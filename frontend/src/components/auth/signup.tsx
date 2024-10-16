import {Button, Heading, Link, TextField, Text, InlineAlert} from '@topihenrik/funktia';
import {MAKE_USER} from '../graphql/mutations.ts';
import {useMutation} from '@apollo/client';
import {useNavigate} from 'react-router-dom';
import {SyntheticEvent, useEffect, useState} from 'react';

export function SignUp() {
    const [signUp, {data, error: mutationError}] = useMutation(MAKE_USER);
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [image, setImage] = useState<File | undefined>();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event: SyntheticEvent<HTMLInputElement>) => {
        const inputFileElement = event.target as HTMLInputElement;
        if (!inputFileElement.files) {
            setImage(undefined);
            return;
        }
        setImage(inputFileElement.files[0]);
    };

    async function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        console.log(image);

        await signUp({
            variables: {
                email,
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                password: password,
                image,
            },
        });
    }

    useEffect(() => {
        if (data?.makeUser) {
            navigate('/login');
        }
    }, [data, navigate]);

    return (
        <div className="flex flex-col gap-4 w-fit">
            <div className="flex items-center bg-blue-600 shadow-xl rounded-xl p-8">
                <Heading level={3} className="text-white font-semibold">
                    💻 Jobitory
                </Heading>
            </div>
            <div className="flex flex-col border-2 border-solid border-neutral-100 shadow-xl rounded-xl p-8">
                <div className="flex flex-col gap-4">
                    <Heading level={5}>Let's collect information for your profile</Heading>
                    <Text className="font-bold">
                        {'Have an account? '}
                        <Link href="/login">Log in now</Link>
                    </Text>
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <TextField
                                onChange={setFirstName}
                                label="First name"
                                placeholder="First name"
                                type="text"
                                name="first_name"
                            />
                            <TextField
                                onChange={setLastName}
                                label="Last name"
                                placeholder="Last name"
                                type="text"
                                name="last_name"
                            />
                        </div>
                        <div className="flex gap-2">
                            <TextField onChange={setEmail} label="Email" placeholder="Email" type="text" name="email" />
                            <TextField
                                onChange={setPhoneNumber}
                                label="Phone number"
                                placeholder="Phone number"
                                type="text"
                                name="phone_number"
                            />
                        </div>
                        <div className="flex gap-2">
                            <TextField
                                onChange={setPassword}
                                label="Password"
                                placeholder="Password"
                                type="password"
                                name="password"
                            />
                            <TextField
                                onChange={setConfirmPassword}
                                label="Confirm password"
                                placeholder="Confirm password"
                                type="password"
                                name="password"
                            />
                        </div>
                        <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
                        {error && <InlineAlert color={'error'} message={error} />}
                    </div>
                    <Button type="submit" className="mt-4" color="primary">
                        Signup
                    </Button>
                </form>
            </div>
        </div>
    );
}
