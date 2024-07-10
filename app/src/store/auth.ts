export interface AuthState {
    token: string | null;
    email: string | null;
    userId: string | null;
    name: string | null;
}

const initialState: AuthState = {
    token: null,
    email: null,
    userId: null,
    name: null
};

function authReducer(state = initialState, {type, payload}: { type: string; payload?: any }): AuthState {
    switch (type) {
        case 'LOGIN': {
            const loginPayload = payload as AuthState;
            return {
                ...state, 
                token: loginPayload.token, 
                email:  loginPayload.email,
                userId: loginPayload.userId,
                name: loginPayload.name
            };
        }
        case 'LOGOUT': {
            return { ...initialState };
        }
        default:
            return state;
    }
}

export default authReducer;