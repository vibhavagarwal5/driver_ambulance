import {
    API_URL, LOGIN_LOADING, SIGNIN
} from './types';
import {
    handleError
} from './errorAction';
import axios from 'axios';

export const signup = (body) => {
    return dispatch => {
        console.log(body);
        dispatch(loginLoading(true));
        return new Promise((resolve, reject) => {
            axios.post(API_URL+'ambulance/signup/',body).then((response) => {
                console.log('response',response);
                resolve(dispatch(loginLoading(false)));
            })
            .catch(error =>{
                reject(handleError(error));
                dispatch(loginLoading(false));
            });
        })
    };
};

export const signin = (body) => {
    return dispatch => {
        console.log(body);
        dispatch(loginLoading(true));
        return new Promise((resolve, reject) => {
            axios.post(API_URL+'ambulance/signin/',body).then((response) => {
                console.log('response',response);
                resolve(dispatch(signinHelper(response.data)));
                dispatch(loginLoading(false));
            })
            .catch(error =>{
                reject(handleError(error));
                dispatch(loginLoading(false));
            });
        })
    };
};

export function loginLoading(bool) {
    return {
        type: LOGIN_LOADING,
        loading: bool
    };
}

export function signinHelper(details) {
    return {
        type: SIGNIN,
        user: details
    };
}
