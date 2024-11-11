import {createContext, Dispatch, ReactNode, SetStateAction, useState} from 'react';

type ProfileModalContextValue = [boolean, Dispatch<SetStateAction<boolean>>];

export const ProfileModalContext = createContext<ProfileModalContextValue>([false, () => undefined]);

interface ModalProviderProps {
    children: ReactNode;
}

export function ModalProvider({children}: ModalProviderProps) {
    const [isOpen, setIsOpen] = useState(false);

    return <ProfileModalContext.Provider value={[isOpen, setIsOpen]}>{children}</ProfileModalContext.Provider>;
}
