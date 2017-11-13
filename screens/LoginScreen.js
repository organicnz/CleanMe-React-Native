import React from 'react';
import { View, Button, Text, StyleSheet, KeyboardAvoidingView, Image, TextInput, Platform, NativeModules } from 'react-native';
import * as firebase from 'firebase';
import MainTaNavigator from '../navigation/MainTabNavigator';
import { StackNavigator } from 'react-navigation';
import { FormLabel, FormInput } from 'react-native-elements';
import LoginForm from '../components/LoginForm';
import Spinner from "react-native-loading-spinner-overlay";

var Aes = NativeModules.Aes;

import {AuthSession} from "expo";
const FB_APP_ID = "fb153073065429193";

// firebase.initializeApp({
//     apiKey: "AIzaSyCLiTwB4dhM2B8FfhE8KpXdkoooh6fiYS4",
//     authDomain: "reactnativeapp-f761d.firebaseapp.com",
//     databaseURL: "https://reactnativeapp-f761d.firebaseio.com",
//     projectId: "reactnativeapp-f761d",
//     storageBucket: "reactnativeapp-f761d.appspot.com",
//     messagingSenderId: "633226929103"
//   }
// );

export default class login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '', 
            password: '', 
            error: '', 
            loading: false, 
            userInfo: null, 
            viewRef: null 
        };
    }

    async logInFB() {
        const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('153073065429193', {
            permissions: ['public_profile'],
          });
        if (type === 'success') {
          // Get the user's name using Facebook's Graph API
          const response = await fetch(
            `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`);
            const userInfo = await response.json();
            this.setState({userInfo});

          Alert.alert(
            'Logged in!',
            `Hi ${(await response.json()).name}!`,
          );
        }
      }

    onLoginPress() {
        
        this.setState({ error: '', loading: true });

        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ error: '', loading: false });
                this.props.navigation.navigate('Main');

            })
            .catch(() => {
                this.setState({ error: 'Authentication failed', loading: false });

            })

    }

    onSignUpPress() {
        this.setState({ error: '', loading: true });
        const { email, password } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ error: '', loading: false });
                this.props.navigation.navigate('Main');

            })
            .catch(() => {
                this.setState({ error: 'Authentication failed', loading: false });

            })
    }

    _renderUserInfo = () => {
        return (
            <View style={{alignItems: "center"}}>
                <Image
                    source={{uri: this.state.userInfo.picture.data.url}}
                    style={{width: 80, height: 80, borderRadius: 40}}
                />
                <Text style={{fontSize: 20}}>{this.state.userInfo.name}</Text>
                {/* <Text>ID: 
                    {this.state.userInfo.name}
                </Text>                 */}
            </View>
        );
    }

    renderButtonOrLoading() {
        if (this.state.loading) {
            return <Spinner visible={this.state.loading} />
        }
        return (
            <View >

                <Button style={styles.buttonContainer}
                    onPress={this.onLoginPress.bind(this)}
                    style={styles.button}
                    // underlineColorAndroid={"transparent"}
                    title='Log In'/>

                <Button style={styles.buttonContainer}
                    onPress={this.onSignUpPress.bind(this)}
                    style={styles.button}
                    title='Sign Up'/>

            </View>
        );
    }
    render() {
        return (
            
            <View style={styles.container}>

                <Image blurRadius={ Platform.OS == 'ios' ? 10 : 5 } source={ {uri: 'https://cdn-images-1.medium.com/max/1920/1*RN5wLmZjU8oY2Yq89D1k4A.png'} } style={styles.MainContainer} >
                    {/* Put All Your Component Here Inside Root Image Component. */}
                    
                    <Image style={{width: 250, height: 80, marginVertical: 50}}
                        source = {require("../assets/images/cleanmelogotext.png")}>

                    </Image>
                    {/* <Text style={styles.logoText}>
                            Auckland Cleaning Services
                    </Text> */}

                    <View style={styles.formContainer}>
                        
                        <TextInput
                            value = {this.state.email} 
                            onChangeText={email => this.setState({ email })}
                            placeholder='john@email.com'
                            placeholderTextColor="#808080"
                            underlineColorAndroid={"transparent"}
                            style={styles.textInput}
                        />

                        <TextInput 
                            value = {this.state.password}
                            secureTextEntry
                            placeholder='*******'
                            placeholderTextColor="#808080"
                            underlineColorAndroid={"transparent"}
                            onChangeText={password => this.setState({ password })}
                            style={styles.textInput}
                        />
                        <Text style={styles.alertContainer}>
                            {this.state.error}
                        </Text>
                        
                        {this.renderButtonOrLoading()}
                        
                        {!this.state.userInfo ? (
                            <Button title = "Log In with Facebook" onPress={this.logInFB.bind(this)} />
                            ):(this._renderUserInfo())}
                    
                    </View>                   
                </Image>               
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        width: null,
        justifyContent: "center",
        // alignItems: "center",
    },
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
    },
    formContainer:{
        alignSelf: "stretch",
        paddingLeft: 20,
        paddingRight: 20,
    },
    textInput: {
        alignSelf: "stretch",
        padding: 20,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        marginBottom: 20,
    },
    alertContainer: {
        alignSelf: "stretch",
        padding: 5,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "transparent",
    },
    logoText: {
        flex: 1,
        alignSelf: "stretch",
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "transparent",
        fontSize: 18,
    },
    button: {
        alignSelf: "stretch",
        padding: 20,
        backgroundColor: "rgba(255, 255, 0, 0.8)",
        marginBottom: 20,
        alignItems: "center",
    },
    btntext: {
        color: "#fff",
        fontSize: 18,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        borderRadius: 25,        
    },
});