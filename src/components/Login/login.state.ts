export interface User {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    bio?: string;
    isNewUser?: boolean;
}

export interface LoginState {
    user: User | null;
}