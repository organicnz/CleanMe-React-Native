import { Permissions, Notifications } from 'expo';
import * as firebase from 'firebase';



firebase.initializeApp({
  apiKey: "AIzaSyCLiTwB4dhM2B8FfhE8KpXdkoooh6fiYS4",
  authDomain: "reactnativeapp-f761d.firebaseapp.com",
  databaseURL: "https://reactnativeapp-f761d.firebaseio.com",
  projectId: "reactnativeapp-f761d",
  storageBucket: "reactnativeapp-f761d.appspot.com",
  messagingSenderId: "633226929103"
});


export default (async function registerForPushNotificationsAsync() {
  // Android remote notification permissions are granted during the app
  // install, so this will only ask on iOS
  let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    return;
  }
  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();



  userID = firebase.auth().currentUser.uid;

  firebase.database().ref('/users/' + userID).update({ token: token });



  // // POST the token to our backend so we can use it to send pushes from there
  // return fetch(PUSH_ENDPOINT, {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     token: {
  //       value: token,
  //     },
  //   }),
  // });
});