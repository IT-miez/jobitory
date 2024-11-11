import {useLocalStorage} from 'usehooks-ts';
import {storageKeys} from '../constants/storagekeys.ts';

export function useAuthTokenStorage() {
    return useLocalStorage<string | null>(storageKeys.auth_token, null);
}

export function useEmailStorage() {
    return useLocalStorage<string | null>(storageKeys.email, null);
}

export function useUserIdStorage() {
    return useLocalStorage<string | null>(storageKeys.user_id, null);
}
