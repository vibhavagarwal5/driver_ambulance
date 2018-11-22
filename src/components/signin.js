import React, { Component } from 'react';
import { StyleSheet, Text, View,TextInput,TouchableOpacity } from 'react-native';
import {
    bindActionCreators
} from 'redux'
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {styles} from '../assets/login_styles'
import {signin} from '../actions/loginAction';

class SignIn extends Component {
    constructor(props) {
		super(props);
		this.state = {
            number_plate:'',
            contact_number:''
        };
    }

    handleSignIn(){
        this.props.signin(this.state).then(()=>{
            Actions.map()
        })
    }
    
	render() {
		return (
			<View style={styles.container}>
                    <Text style={styles.heading}>Ambulance Services</Text>
                    <Text>Number plate</Text>
                    <TextInput
                        ref={input => (this.number_plateInput = input)}
                        onChangeText={number_plate => this.setState({ number_plate })}
                        onSubmitEditing={() => this.phoneInput.focus()}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        placeholder="Number plate"
                        underlineColorAndroid='black'
                    />
                    <Text style={styles.inputfieldText}>Contact Number</Text>
                    <TextInput
                        ref={input => (this.phoneInput = input)}
                        onChangeText={contact_number => this.setState({ contact_number })}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='number-pad'
                        returnKeyType="next"
                        placeholder="Contact Number"
                        underlineColorAndroid='black'
                    />
					<TouchableOpacity
                        onPress={() => this.handleSignIn()}
                        style={styles.loginButton}
					>
						<Text style={styles.loginText}> Login </Text>
					</TouchableOpacity>
                    <View style={styles.register}>
                        <Text style={styles.registerText}>Don't have an account?</Text>
                        <TouchableOpacity
                            onPress={() => Actions.signup()}
                        >
                            <Text style={styles.loginText}> Register </Text>
                        </TouchableOpacity>
                    </View>
				</View>
		);
	}
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            signin: signin
        },
        dispatch
    );
}

// const mapStateToProps = state => ({
//     user: state.login.user
// });

export default connect(null, matchDispatchToProps)(SignIn);
