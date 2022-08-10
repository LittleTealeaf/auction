export function getSessionId() {
    return sessionStorage.getItem("sid");
}

export function setSessionId(sid: string) {
    sessionStorage.setItem('sid',sid);
}

export function clearSessionId() {
    sessionStorage.removeItem('sid');
}
