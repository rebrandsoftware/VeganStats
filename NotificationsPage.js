/*jshint esversion: 6 */

'use strict';

import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import NotificationsIOS, { NotificationAction, NotificationCategory } from 'react-native-notifications';

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const notificationCount = 10;
const notificationCountBday = 15;

const TurnOnButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.turnOnButton}
      onPress={props.onPress}
    >
      <Text style={styles.turnOnButtonText}>Enable Notifications</Text>
    </TouchableOpacity>
  );
};

const TurnOffButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.turnOffButton}
      onPress={props.onPress}
    >
      <Text style={styles.turnOffButtonText}>Disable Notifications</Text>
    </TouchableOpacity>
  );
};

const TestButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.testButton}
      onPress={props.onPress}
    >
      <Text style={styles.testButtonText}>Test Notifications</Text>
    </TouchableOpacity>
  );
};

function dateTargetReached(amountPerDay, currentAmount, targetAmount) {
  // console.log("amountPerDay: " + amountPerDay);
  // console.log("currentAmount:" + currentAmount);
  // console.log("targetAmount: " + targetAmount);

  var amountToGet = targetAmount - currentAmount; //we need to get the difference between current and target
  var startDate = new Date();  //start counting from today
  var startDateMS = startDate.getTime();
  var amountPerMS = amountPerDay / 86400 / 1000; //determine the rate per ms
  var msToTarget = amountToGet / amountPerMS;  //determine how many milliseconds it will take to reach the target
  var newDate = new Date();
  // console.log("startDateMS: " + startDateMS);
  // console.log("msToTarget: " + msToTarget);
  var totalMS = startDateMS + msToTarget;
  //console.log("totalMS: " + totalMS);
  newDate.setTime(totalMS);  //combine today plus the time to target
  // console.log("newDate:");
  // console.log(newDate);
  newDate.setDate(newDate.getDate()+1); //add a day just to be sure they have passed the target
  // console.log("newDate+1:");
  //console.log(newDate);
  //avoid sending notifications in the middle of the night
  if (newDate.getHours() < 10) {
    newDate.setHours(10);
  } else if (newDate.getHours() > 20) {
    newDate.setHours(20);
  }

  //console.log(newDate);
  return newDate;
}

function futureStats(stats, startDateSQL) {
  //calculates the future benchmarks

  var perDayArray = [
    { key:'water', desc:'Gallons of Water', icon:'cup-water', color:'#00F', value:1100},
    { key:'grain', desc:'Pounds of Grain', icon:'barley', color:'#f5deb3',value:40},
    { key:'forest', desc:'Square Feet of Forest', icon:'pine-tree', color:'#228B22',value:30},
    { key:'co2', desc:'Pounds of Co2', icon:'car-hatchback', color:'#A9A9A9',value:20},
    { key:'animals', desc:"Animal's Life", icon:'pig', color:'#FFC0CB',value:1},
  ];
  var significant;
  var item;
  var value;
  var floored;
  var targetValue;
  var targetDate;
  var i;
  var notificationArray=[];
  var amountPerDay;

  addToNotificationArray(notificationArray, "Water", "Environmental Milestone", "You have saved [#] gallons of water by being vegan!", 100000, stats[0], perDayArray[0].value, function(notificationArray) {
    addToNotificationArray(notificationArray, "Grain", "Environmental Milestone", "You have saved [#] pounds of grain by being vegan!", 25000, stats[1], perDayArray[1].value, function(notificationArray) {
      addToNotificationArray(notificationArray, "Forest", "Environmental Milestone", "You have saved [#] square feet of forest by being vegan!", 10000, stats[2], perDayArray[2].value, function(notificationArray) {
        addToNotificationArray(notificationArray, "Co2", "Environmental Milestone", "You have saved [#] pounds of Co2 by being vegan!", 10000, stats[3], perDayArray[3].value, function(notificationArray) {
          addToNotificationArray(notificationArray, "Animals", "Compassion Milestone", "You have saved [#] animals' lives by being vegan!", 100, stats[4], perDayArray[4].value, function(notificationArray) {
            addToNotificationArrayBDay(notificationArray, "Anniversary", "Happy Veganniversary!", "You have been vegan for [#] years! Amazing!", startDateSQL, function(notificationArray) {
              console.log("Final array:");
              console.log(notificationArray);
              return notificationArray;
            });
          });
        });
      });
    });
  });
}

function addToNotificationArray(notificationArray, nKey, nTitle, nDesc, significant, item, amountPerDay, callback) {
  console.log("addToNotificationArray: " + nTitle);
  var value = item.value;
  var targetValue = Math.floor(value / significant) * significant;
  var targetDate;
  var i;
  var newDesc;
  for (i=0; i<notificationCount; i++) {
    targetValue = targetValue + significant; //increase by each significant amount
    //find the date when the person will reach the target
    targetDate = dateTargetReached(amountPerDay, value, targetValue);
    //set a notification
    if (targetDate) {
        newDesc = nDesc.replace("[#]", numberWithCommas(targetValue));
        notificationArray.push({key: nKey + i, title: nTitle, desc: newDesc, fireDate: targetDate});
    }
  }
  callback(notificationArray);
}

function addToNotificationArrayBDay(notificationArray, nKey, nTitle, nDesc, startDateSQL, callback) {
  console.log("addToNotificationArrayBday: " + nTitle);
  var targetDate;
  var i;
  var newDesc;
  var startDate = new Date(startDateSQL);
  var newDate;
  startDate.setDate(startDate.getDate() + 1); //sql seems to lose a day
  console.log("startDate: ");
  console.log(startDate);
  //avoid sending notifications in the middle of the night
  if (startDate.getHours() < 10) {
    startDate.setHours(10);
  } else if (startDate.getHours() > 20) {
    startDate.setHours(20);
  }

  var iAdded =0;
  var addIt = function(nKey, nTitle, newDesc, fireDate, callback) {
    console.log(fireDate);
    notificationArray.push({key: nKey + i, title: nTitle, desc: newDesc, fireDate: startDate});
    callback();
  }

  for (i=0; i<notificationCountBday; i++) {
    newDate = startDate;
    newDate.setFullYear(startDate.getFullYear() + (i + 1));
    //startDate.setFullYear(startDate.getFullYear() + 1); //increase each date by 1 year
    console.log(startDate.getFullYear());
    //set a notification
    newDesc = nDesc.replace("[#]", i);

    addIt(nKey, nTitle, newDesc, newDate, function() {
      iAdded ++;
      console.log(iAdded);
      if (iAdded === notificationCountBday) {
        callback(notificationArray);
      }
    });

  }
  if (notificationCountBday === 0) {
    callback(notificationArray);
  }
}

function statsFromSeconds(seconds) {


  var newArray = perDayArray.map(obj =>{
     obj.value = Math.round(((obj.value / 86400) * seconds));
     if (obj.key === 'animals' && obj.value > 1) {
       obj.desc = "Animals' Lives";
     }
     return obj;
  });
  return newArray;
}

function secondsFromStartDate(startDateSQL) {
  var startDate = new Date(startDateSQL);
  startDate.setDate(startDate.getDate() + 1); //sql seems to lose a day
  var endDate = new Date();
  return Math.round((endDate.getTime() - startDate.getTime()) / 1000);
}

export default class NotificationsPage extends Component<{}> {
  static navigationOptions = {
    title: 'Notifications',
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      date: navigation.getParam('date', ''),
      stats: navigation.getParam('stats'),
    };

    NotificationsIOS.addEventListener('remoteNotificationsRegistered', this.onPushRegistered.bind(this));


    NotificationsIOS.consumeBackgroundQueue();

    NotificationsIOS.addEventListener('pushKitRegistered', this.onPushKitRegistered.bind(this));
    NotificationsIOS.registerPushKit();

    NotificationsIOS.addEventListener('notificationReceivedForeground', this.onNotificationReceivedForeground.bind(this));
    NotificationsIOS.addEventListener('notificationReceivedBackground', this.onNotificationReceivedBackground.bind(this));
    NotificationsIOS.addEventListener('notificationOpened', this.onNotificationOpened.bind(this));
  }

  onPushRegistered(deviceToken) {
    console.log("Device Token Received: " + deviceToken);
  }

  onPushKitRegistered(deviceToken) {
    console.log("PushKit Token Received: " + deviceToken);
  }

  onNotificationReceivedForeground(notification) {
    console.log("Notification Received Foreground: " + JSON.stringify(notification));
  }

  onNotificationReceivedBackground(notification) {
    NotificationsIOS.log("Notification Received Background: " + JSON.stringify(notification));

    let localNotification = NotificationsIOS.localNotification({
      alertBody: "Received background notificiation!",
      alertTitle: "Local Notification Title",
      alertAction: "Click here to open",
      soundName: "chime.aiff",
      category: "SOME_CATEGORY",
      userInfo: notification.getData()
    });

    // if you want to fire the local notification 10 seconds later,
    // add the following line to the notification payload:
    //      fireDate: new Date(Date.now() + (10 * 1000)).toISOString()

    // NotificationsIOS.backgroundTimeRemaining(time => NotificationsIOS.log("remaining background time: " + time));

    // NotificationsIOS.cancelLocalNotification(localNotification);
  }

  onNotificationOpened(notification) {
    console.log("Notification Opened: " + JSON.stringify(notification));
  }

  _doNotifications(stats, date) {
    console.log("do notifications");
    NotificationsIOS.requestPermissions();
    NotificationsIOS.cancelAllLocalNotifications();
    var notificationArray = futureStats(stats, date);
    var i;
    var l = notificationArray.length;
    var notification;

    for (i=0;i<l;i++) {
        notification = notificationArray[i];
        let localNotification = NotificationsIOS.localNotification({
          fireDate: notification.fireDate,
          alertBody: notification.desc,
          alertTitle: notification.title,
          soundName: "chime.aiff",
            silent: false,
          category: "ACHIEVEMENT",
          userInfo: { }
        });
    }
  }

  _doNotificationsOff() {
    console.log("do notifications off");
    NotificationsIOS.cancelAllLocalNotifications();
  }

  _doNotificationsTest() {
    console.log("do notifications test");
    var myDate = new Date()
    myDate.setSeconds(myDate.getSeconds() + 10);

    NotificationsIOS.requestPermissions();
    let localNotification = NotificationsIOS.localNotification({
      fireDate: myDate,
      alertBody: "This is a test notification",
      alertTitle: "Testing 1 2 3!",
      soundName: "chime.aiff",
        silent: false,
      category: "TEST",
      userInfo: { }
    });
  }

  render() {

      return (
      <View>
        <ScrollView>
        <View style={styles.container}>

        <Text style={styles.normal}>Enable or disable notifications on your &quot;veganniversary&quot; and when you reach certain environmental or compassionate milestones.</Text>
        <TurnOnButton
        onPress={() => this._doNotifications(this.state.stats, this.state.date)}
        />
        <TurnOffButton
        onPress={this._doNotificationsOff}
        />
        <TestButton
        onPress={this._doNotificationsTest}
        />
        </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 35,
  },
  normal: {
    fontSize: 16,
    color: '#000',
    marginBottom: 35
  },
  turnOnButton: {
    width: '100%',
    backgroundColor: '#74B900',
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  turnOnButtonText: {
    fontSize: 20,
    color: 'white',
  },
  turnOffButton: {
    width: '100%',
    backgroundColor: '#FF787A',
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  turnOffButtonText: {
    fontSize: 20,
    color: 'white',
  },
  testButton: {
    width: '100%',
    backgroundColor: '#0000FF',
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 20,
    color: 'white',
  }
});
