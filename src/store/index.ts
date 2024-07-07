import { combineReducers } from 'redux';
import authReducer from './auth';

interface AppState { }
const initialState: AppState = {};

function reducer(state = initialState, { type }: { type: string; payload?: any }): AppState {
    switch (type) {
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    core: reducer,
    auth: authReducer
});

export default rootReducer;