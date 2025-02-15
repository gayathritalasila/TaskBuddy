import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginState, User } from "./login.state";

const initialState: LoginState = {
    user: JSON.parse(localStorage.getItem("user") || "null"),
};

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            const user = action.payload;
            state.user = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                bio: user.bio,
                isNewUser: user.isNewUser,
            };
        },
        logout: (state) => {
            localStorage.removeItem("user");
            state.user = null;
        },
        updateProfile: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
});

export const { login, logout, updateProfile } = loginSlice.actions;
export default loginSlice.reducer;