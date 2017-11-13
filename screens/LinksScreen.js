import React from 'react';
import { ScrollView, StyleSheet, View, Text, Alert, ListView, Platform, Image } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
import { Notifications } from 'expo';
import * as firebase from 'firebase';
import { List, ListItem, Button } from 'react-native-elements';
import Expo from 'expo';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };
  constructor(props) {
    super(props);

    this.state = {
      notification: {},
      userID: '',
      notificationsAvailable: [],
      error: '',
      dataSource: new ListView.DataSource({
        rowHasChanged: () => false,
        sectionHeaderHasChanged: () => false,
      }),
    };
  }
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
   // this._clearIconBadgeAsync();  
  }
  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  
    
  }

  // //use later for push notification description
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.getStartedContainer}>

            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]} >
              <MonoText style={styles.codeHighlightText}>We are accepting Cryptocurrencies. And Blockchain integration is coming up soon.{JSON.stringify(this.state.notification.data)}</MonoText>
            </View>

            <Text style={styles.cryptoText}>
              Bitcoin:  16JdQCHxB3CiAkwL13c5aAjAGFPD134sW8
            </Text>

            <Text style={styles.cryptoText}>
              Ethereum: 0xe3db5718a40ecf53834c1ae0fb91208622fa1e94
            </Text>

            {/* <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText style={styles.codeHighlightText}>Blockchain integration is coming soon{this.state.notification.origin}</MonoText>
            </View>

            <Text style={styles.getStartedText}>
              “The blockchain is an incorruptible digital ledger of economic transactions that can be programmed to record not just financial transactions but virtually everything of value.”  - Don & Alex Tapscott
              
              The blockchain is an undeniably ingenious invention – the brainchild of a person or group of people known by the pseudonym, Satoshi Nakamoto.
              
              By allowing digital information to be distributed but not copied, blockchain technology created the backbone of a new type of internet. Originally devised for the digital currency, Bitcoin, the tech community is now finding other potential uses for the technology.
              
              Bitcoin has been called “digital gold”, and for good reason. To date, the total value of currency is close to $9 billion US. And blockchains can make other types of digital value. Like the internet (or your car), you don’t need to know how the blockchain works to use it. However, having a basic knowledge of this new technology shows why it’s considered revolutionary.
            </Text> */}

          </View>
        </ScrollView>

      </View>
    );
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }
  _handleNotification = (notification) => {
    this.userID = firebase.auth().currentUser.uid;
    this.props.navigation.navigate('Notifications');
    this.setState({ notification: notification });

    firebase.database().ref('users/' + this.userID + '/notifications').push(notification.data);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 15,
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  }, 
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
    textAlign: 'center',
  },
  homeScreenFilename: {
    marginVertical: 7,
    textAlign: 'center',
  },
  cryptoText: {
    // fontSize: 15,
    color: 'rgba(96,100,109, 1)',
    // lineHeight: 15,
    textAlign: 'left',
  }
});