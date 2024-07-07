export interface AuthState {
    token: string | null;
    email: string | null;
}

const initialState: AuthState = {
    token: null,
    email: null
};

function authReducer(state = initialState, {type, payload}: { type: string; payload?: any }): AuthState {
    switch (type) {
        case 'LOGIN': {
            const loginPayload = payload as { token: string, email: string };
            return { ...state, token: loginPayload.token, email:  loginPayload.email };
        }
        case 'LOGOUT': {
            return { ...initialState };
        }
        default:
            return state;
    }
}

export default authReducer;