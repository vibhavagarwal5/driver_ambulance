import {
    ERROR_HANDLING
} from './types';

export function handleError(error) {
    console.log(error.response);
    return {
        type: ERROR_HANDLING,
        error: error
    };
}
