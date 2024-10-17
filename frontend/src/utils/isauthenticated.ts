import {storageKeys} from '../constants/storagekeys.ts';

export function isAuthenticated() {
    return !!localStorage.getItem(storageKeys.auth_token);
}
