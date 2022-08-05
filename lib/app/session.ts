import { UserData } from "types/api";

export function setSessionAuth(auth: string) {
    sessionStorage.setItem('auth',auth);
}

export function getSessionAuth(): string | null {
    return sessionStorage.getItem('auth');
}

export function clearSessionAuth() {
    return sessionStorage.removeItem('auth');
}

export function setSessionUser(user: UserData) {
    sessionStorage.setItem('user',JSON.stringify(user));
}

export function getSessionUser(): UserData | null {
    const user = sessionStorage.getItem('user');
    return user == null ? null : JSON.parse(user);
}
