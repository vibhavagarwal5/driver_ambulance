import {
    API_URL,
    TRIP_LOADING,
    CURRENT_TRIP,
    GET_TRIP,
    FLIP_TRIP,
    END_TRIP
} from './types';
import {
    handleError
} from './errorAction';
import axios from 'axios';

import configureStore from '../utils/store';
let {
    store,
    persistor
} = configureStore();

export const getTrip = (id) => {
    return dispatch => {
        dispatch(tripLoading(true));
        return new Promise((resolve, reject) => {
            axios.get(API_URL + 'ambulance/?id='+id, {
                    headers: {
                        Authorization: store.getState().login.user.token
                    }
                }).then((response) => {
                    resolve(dispatch(getTripHelper(response.data[0].trips)));
                    dispatch(tripLoading(false));
                })
                .catch(error => {
                    reject(handleError(error));
                    dispatch(tripLoading(false));
                });
        })
    };
};


export const setCurrentTrip = (trip) => {
    return dispatch => {
        dispatch(tripLoading(true));
        return new Promise((resolve, reject) => {
            axios.get(API_URL + 'patient/?id='+trip.patient_id, {
                headers: {
                    Authorization: store.getState().login.user.token
                }
            }).then((patient) => {
                console.log(patient);
                axios.get(API_URL + 'hospital/?id='+trip.hospital_id, {
                    headers: {
                        Authorization: store.getState().login.user.token
                    }
                }).then((hospital) => {
                    resolve(dispatch(setCurrentTripHelper(hospital.data[0],patient.data[0],trip)));
                })
                .catch(error => {
                    reject(handleError(error));
                });
                dispatch(tripLoading(false));
            })
            .catch(error => {
                reject(handleError(error));
                dispatch(tripLoading(false));
            });
        })
    };
};

export const endTrip = () => {
    console.log(store.getState().login.user.token);
    return dispatch => {
        dispatch(tripLoading(true));
        return new Promise((resolve, reject) => {
            axios.put(API_URL + 'ambulance/complete/?id='+store.getState().login.user.id, null, {
                headers: {
                    Authorization: store.getState().login.user.token
                }
            }).then((patient) => {
                console.log(patient);
                axios.put(API_URL + 'trip/?id='+store.getState().trip.trip.id, null, {
                    headers: {
                        Authorization: store.getState().login.user.token
                    }
                }).then((hospital) => {
                    console.log(hospital);
                    resolve(dispatch(endTripHelper()));
                })
                .catch(error => {
                    reject(handleError(error));
                });
                dispatch(tripLoading(false));
            })
            .catch(error => {
                reject(handleError(error));
                dispatch(tripLoading(false));
            });
        })
    };
};

function tripLoading(bool) {
    return {
        type: TRIP_LOADING,
        loading: bool
    };
}

function getTripHelper(details) {
    return {
        type: GET_TRIP,
        all_trips: details
    };
}

export function setCurrentTripHelper(hospital_info,patient_info,trip) {
    return {
        type: CURRENT_TRIP,
        trip: {
            ...trip,
            patient:{
                id: patient_info.id,
                name: patient_info.name,
                dob: patient_info.dob,
                contact_number: patient_info.contact_number
            },
            hospital:{
                id: hospital_info.id,
                name: hospital_info.name,
                latitude: hospital_info.latitude,
                longitude: hospital_info.longitude
            }
        }
    }
}

export function flipTrip() {
    return {
        type: FLIP_TRIP,
        user2hosp: true
    }
}

function endTripHelper() {
    return {
        type: END_TRIP,
        all_trips: null,
        trip: null,
        amb2user: true,
        user2hosp: false
    }
}
