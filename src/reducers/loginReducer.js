import {
    SIGNIN,
    SIGN_OUT,
    LOGIN_LOADING
} from '../actions/types';

const INITIAL_STATE = {
    user:null,
    loading:false
};

export default function (state = INITIAL_STATE, action) {
    let result = Object.assign({}, state);
    switch (action.type) {
        case SIGNIN:
            return {
                ...result,
                user: {
                    ...result.user,
                    contact_number: action.user.contact_number,
                    id: action.user.id,
                    number_plate: action.user.number_plate,
                    token: 'Token ' + action.user.token
                }
            };
        case SIGN_OUT:
            return {
                ...state
            };
        case LOGIN_LOADING:
            return {
                ...result,
                loading: action.loading
            };
        default:
            return state;
    }
}
