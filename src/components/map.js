import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
    bindActionCreators
} from 'redux'
import { connect } from 'react-redux';
import {
    watchCurrLocation,
    set_curr_region
} from '../actions/locationAction';
import {
    getTrip,
    flipTrip,
    endTrip,
    setCurrentTrip
} from '../actions/tripAction';
import { signout } from '../actions/loginAction';
import Config from 'react-native-config'
import { styles } from '../assets/map_styles'
import Icon from 'react-native-vector-icons/AntDesign';
import { Actions } from 'react-native-router-flux';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
var haversine = require('haversine-distance');

class MapScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            origin: {
                latitude: this.props.curr_coordinates.latitude,
                longitude: this.props.curr_coordinates.longitude,
            },
            destination: {
                latitude: this.props.curr_coordinates.latitude,
                longitude: this.props.curr_coordinates.longitude,
            }
        };
    }

    componentDidMount() {
        this.props.watchCurrLocation();
        var self = this;
        this.checkTrip = setInterval(function(){
            if(self.props.trip.trip === null){
                self.props.getTrip(self.props.login.user.id).then(()=>{
                    for(item in self.props.trip.all_trips){
                        console.log(self.props.trip.all_trips[item].on_trip);
                        if(self.props.trip.all_trips[item].on_trip){
                            self.props.setCurrentTrip(self.props.trip.all_trips[item]).then(()=>{
                                self.handleTrips();
                            })
                        }
                    }
                })
            }
        },5000)
    }
    
    componentWillUnmount(){
        clearInterval(this.checkTrip);
    }

    handleTrips(){
        var self = this;
        console.log(self.props.trip.trip);
        self.setState({
            destination:{
                latitude: self.props.trip.trip.start_latitude,
                longitude: self.props.trip.trip.start_longitude
            },
        })
        var fulltrip = setInterval(function() {
            self.setState({
                origin:{
                    latitude: self.props.curr_coordinates.latitude,
                    longitude: self.props.curr_coordinates.longitude
                }
            })
            if(haversine(self.state.origin, self.state.destination) < 30.0 && self.props.trip.user2hosp){
                console.log('inside trip closure');
                clearInterval(fulltrip);
                self.props.endTrip();
                self.setState({
                    destination:{
                        latitude: self.props.curr_coordinates.latitude,
                        longitude: self.props.curr_coordinates.longitude
                    }
                });
            }
            else if(haversine(self.state.origin, self.state.destination) < 30.0 && self.props.trip.amb2user && self.props.trip.trip !== null){
                console.log('inside flip');
                self.props.flipTrip();
                self.setState({
                    destination:{
                        latitude: self.props.trip.trip.hospital.latitude,
                        longitude: self.props.trip.trip.hospital.longitude
                    }
                });
            }
            console.log('haversine', haversine(self.state.origin, self.state.destination));
        }, 5000);
    }
   
    onRegionChange(region) {
        this.props.set_curr_region(region)
    }

    handleSignout(){
        this.props.signout();
        Actions.pop();
    }

    render() {
        console.log(this.state);
        
        return (
            <View style={styles.container}>
                <MapView
                    showCompassOnRotate={false}
                    style={styles.map}
                    initialRegion={
                        this.props.curr_region
                    }
                    onRegionChange={(region) =>
                        this.onRegionChange(region)
                    }
                >
                    {
                        this.props.trip.trip !==null ?
                        <View>
                            <MapViewDirections
                                origin={this.state.origin}
                                destination={this.state.destination}
                                apikey={
                                    Config.GOOGLE_MAPS_API_KEY
                                }
                                strokeWidth={3}
                                strokeColor="skyblue"
                            />
                            <Marker
                                coordinate={this.state.destination}
                                title={'Destination'}
                            />
                            <Marker
                                coordinate={this.state.origin}
                                title={'Origin'}
                            />
                        </View>
                        :
                        <Marker
                            coordinate={this.props.curr_coordinates}
                            title={'Current location'}
                        />
                    }
                </MapView>
                <TouchableOpacity
                    onPress={()=>{this.handleSignout()}}
                    style={styles.menu}
                >
                    <Icon
                        name="logout"
                        size={30}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            watchCurrLocation: watchCurrLocation,
            set_curr_region: set_curr_region,
            getTrip: getTrip,
            flipTrip: flipTrip,
            endTrip: endTrip,
            setCurrentTrip: setCurrentTrip,
            signout: signout
        },
        dispatch
    );
}

const mapStateToProps = state => ({
    curr_coordinates: state.location.curr_coordinates,
    curr_region: state.location.curr_region,
    login: state.login,
    trip: state.trip
});

export default connect(mapStateToProps, matchDispatchToProps)(MapScreen);
