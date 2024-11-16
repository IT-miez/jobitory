import {useContext, useMemo} from 'react';
import {Avatar, Heading, Modal, Text} from '@topihenrik/funktia';
import {ProfileModalContext} from '../common/modalprovider.tsx';
import {useQuery} from '@apollo/client';
import {PROFILE_DATA} from '../../graphql/queries.ts';
import {useUserIdStorage} from '../../hooks/usestorage.tsx';
import {UpdateUserForm} from './updateuserform.tsx';

export function ProfileModal() {
    const [userId] = useUserIdStorage();
    const [isOpen, setOpen] = useContext(ProfileModalContext);
    const {data, error, loading} = useQuery(PROFILE_DATA, {variables: {id: Number(userId)}});

    const onChange = (nextValue: boolean) => {
        setOpen(nextValue);
    };

    const {first_name, last_name, email, phone_number, address, post_code, municipality, image_url} = useMemo(
        () => data?.profileData || {},
        [data?.profileData]
    );

    if (error) return null;
    if (loading) return null;
    if (!data) return null;

    return (
        <Modal isOpen={isOpen} onChange={onChange}>
            <div className="flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                    <Avatar src={image_url} />
                    <Heading level={3}>{`${data?.profileData?.first_name} ${data?.profileData?.last_name}`}</Heading>
                </div>
                <Text>You can update your personal details here.</Text>
                <UpdateUserForm
                    initialFirstName={first_name}
                    initialLastName={last_name}
                    initialEmail={email}
                    initialPhoneNumber={phone_number}
                    initialAddress={address}
                    initialPostCode={post_code}
                    initialMunicipality={municipality}
                />
            </div>
        </Modal>
    );
}
