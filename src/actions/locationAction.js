import {
    CURR_LOCATION,
    CURR_REGION,
    API_URL
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

export const watchCurrLocation = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.watchPosition(
                position => {
                    let data = {};
                    data.latitude = parseFloat(position.coords.latitude);
                    data.longitude = parseFloat(position.coords.longitude);
                    resolve(dispatch(set_currLocation(data)));
                    update_location(data);
                },
                error => {
                    reject(dispatch(handleError(error)));
                    console.log(error.message);
                }, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 6000,
                    distanceFilter: 10
                }
            );
        });
    };
};

export function set_curr_region(region) {
    return {
        type: CURR_REGION,
        curr_region: region
    };
}

function set_currLocation(location) {
    return {
        type: CURR_LOCATION,
        curr_coordinates: location
    };
}

function update_location(location) {
    return axios.put(
        API_URL + 'ambulance/location/?id='+ store.getState().login.user.id, 
        location,
        {
            headers: {
                Authorization: store.getState().login.user.token
            }
        }
    ).then((response)=>{
        console.log(response);
    })
    .catch(error => {
        handleError(error);
    });
}
