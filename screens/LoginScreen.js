import React from 'react';
import { View, Button, Text, StyleSheet, KeyboardAvoidingView, Image, TextInput } from 'react-native';
import * as firebase from 'firebase';
import MainTaNavigator from '../navigation/MainTabNavigator';
import { StackNavigator } from 'react-navigation';
import { FormLabel, FormInput } from 'react-native-elements';

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
        this.state = { email: '', password: '', error: '', loading: false, userInfo: null };
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
                    style={{width: 100, height: 100, borderRadius: 50}}
                />
                <Text style={{fontSize: 20}}>{this.state.userInfo.name}</Text>
                <Text>ID: {this.state.userInfo.name}</Text>                
            </View>
        );
    }

    renderButtonOrLoading() {
        if (this.state.loading) {
            return <Text> Loading </Text>
        }
        return <View>
            <Button
                onPress={this.onLoginPress.bind(this)}
                title='Login'/>
            <Button
                onPress={this.onSignUpPress.bind(this)}
                title='Sign up'/>
        </View>

    }
    render() {
        return (
            <View>
                {/* <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
                    <Image style={styles.container}source={require('../assets/images/bg.jpg')}>

                    </Image>
                </KeyboardAvoidingView>    */}
                <FormLabel>Email</FormLabel>
                <FormInput
                 value = {this.state.email} 
                 onChangeText={email => this.setState({ email })}
                 placeholder='john@email.com'
                 />
                <FormLabel>Password</FormLabel>
                <FormInput 
                value = {this.state.password}
                secureTextEntry
                placeholder='*******'
                onChangeText={password => this.setState({ password })}
                />
                <Text>{this.state.error}</Text>
                {this.renderButtonOrLoading()}

                {!this.state.userInfo ? (<Button title = "Connect with Facebook" onPress={this.logInFB.bind(this)} />):(this._renderUserInfo())}

            </View>

        )

    }


}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignSelf: "stretch",
//         width: null,
//         // justifyContent: "center",
//         // alignItems: "center",
//     },
//     wrapper: {
//         flex: 1,
//     },
// })