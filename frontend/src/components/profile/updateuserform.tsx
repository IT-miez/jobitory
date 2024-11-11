import {Button, Form, TextField, toastQueue} from '@topihenrik/funktia';
import {SyntheticEvent, useContext, useState} from 'react';
import {useJobitoryMutation} from '../../hooks/usejobitorymutation.tsx';
import {UPDATE_USER} from '../../graphql/mutations.ts';
import {useNavigate} from 'react-router-dom';
import {useEmailStorage, useUserIdStorage} from '../../hooks/usestorage.tsx';
import {ProfileModalContext} from '../common/modalprovider.tsx';
import {PROFILE_DATA} from '../../graphql/queries.ts';

interface UpdateUserFormProps {
    initialFirstName?: string;
    initialLastName?: string;
    initialEmail?: string;
    initialPhoneNumber?: string;
    initialAddress?: string;
    initialPostCode?: string;
    initialMunicipality?: string;
}

export function UpdateUserForm({
    initialFirstName,
    initialLastName,
    initialEmail,
    initialPhoneNumber,
    initialAddress,
    initialPostCode,
    initialMunicipality,
}: UpdateUserFormProps) {
    const navigate = useNavigate();
    const [, setIsOpen] = useContext(ProfileModalContext);
    const [userId] = useUserIdStorage();
    const [storageEmail] = useEmailStorage();
    const [updateUser, {error}] = useJobitoryMutation(UPDATE_USER, {
        onCompleted: (data) => {
            if (typeof data?.updateUser?.user?.email === 'string' && storageEmail !== data?.updateUser?.user?.email) {
                toastQueue.add({element: 'Email updated. Please log in.', color: 'success'}, {timeout: 5000});
                localStorage.clear();
                navigate('/login');
            } else {
                setIsOpen(false);
                toastQueue.add({element: 'Personal details updated', color: 'success'}, {timeout: 5000});
            }
        },
        refetchQueries: [{query: PROFILE_DATA, variables: {id: userId}}],
    });
    const [firstName, setFirstName] = useState(initialFirstName || '');
    const [lastName, setLastName] = useState(initialLastName || '');
    const [email, setEmail] = useState(initialEmail || '');
    const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || '');
    const [address, setAddress] = useState(initialAddress || '');
    const [postCode, setPostCode] = useState(initialPostCode || '');
    const [municipality, setMunicipality] = useState(initialMunicipality || '');

    async function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        await updateUser({
            variables: {
                id: userId,
                first_name: firstName.length ? firstName : null,
                last_name: lastName.length ? lastName : null,
                email: email.length ? email : null,
                phone_number: phoneNumber.length ? phoneNumber : null,
                address: address.length ? address : null,
                post_code: postCode.length ? postCode : null,
                municipality: municipality.length ? municipality : null,
            },
        });
    }

    return (
        <Form className="flex flex-col gap-4" validationErrors={error?.validationErrors} onSubmit={onSubmit}>
            <div>
                <TextField value={firstName} onChange={setFirstName} label="First name" placeholder="First name" />
                <TextField value={lastName} onChange={setLastName} label="Last name" placeholder="Last name" />
                <TextField
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    label="Phone number"
                    placeholder="Phone number"
                />
                <TextField value={email} onChange={setEmail} label="Email" placeholder="Email" />
                <TextField value={address} onChange={setAddress} label="Address" placeholder="Address" />
                <TextField value={postCode} onChange={setPostCode} label="Post code" placeholder="Post code" />
                <TextField
                    value={municipality}
                    onChange={setMunicipality}
                    label="Municipality"
                    placeholder="Municipality"
                />
            </div>
            <div className="flex justify-between">
                <Button color="error">Delete Account</Button>
                <div className="flex gap-2">
                    <Button onPress={() => setIsOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button color="success" type="submit">
                        Save
                    </Button>
                </div>
            </div>
        </Form>
    );
}
