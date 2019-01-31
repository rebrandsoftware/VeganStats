/*jshint esversion: 6 */

'use strict';

import React, {Component} from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

var PushNotification = require('react-native-push-notification');

PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
    },
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: false,
});

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const notificationCount = 1000;
const notificationCountDays = 6;
const notificationCountWeeks= 3;
const notificationCountMonths = 11;
const notificationCountYears = 100;

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
  //given the amount saved per day, the current amount, and a target, return the date we will reach the target

  var amountToGet = targetAmount - currentAmount; //we need to get the difference between current and target
  var startDate = new Date();  //start counting from today
  var startDateMS = startDate.getTime();
  var amountPerMS = amountPerDay / 86400 / 1000; //determine the rate per ms
  var msToTarget = amountToGet / amountPerMS;  //determine how many milliseconds it will take to reach the target
  var newDate = new Date();
  var totalMS = startDateMS + msToTarget;
  newDate.setTime(totalMS);  //combine today plus the time to target
  newDate.setDate(newDate.getDate()+1); //add a day just to be sure they have passed the target

  //avoid sending notifications in the middle of the night
  //Restrict to 10am to 8pm
  if (newDate.getHours() < 10) {
    newDate.setHours(10);
  } else if (newDate.getHours() > 20) {
    newDate.setHours(20);
  }
  return newDate;
}

function futureStats(stats, startDateSQL, metric, callback) {
  //calculates the future benchmarks and returns an array of notifications to set

  var perDayArray;
  var significant;
  var item;
  var value;
  var floored;
  var targetValue;
  var targetDate;
  var i;
  var notificationArray=[];
  var amountPerDay;

  var liquid;
  var solid;
  var volume;

  if (metric == false) {
    liquid="gallons";
    solid="pounds";
    volume = "feet";
    perDayArray = [
      { key:'water', desc:'Gallons of Water', icon:'cup-water', color:'#00F', value:1100},
      { key:'grain', desc:'Pounds of Grain', icon:'barley', color:'#f5deb3',value:40},
      { key:'forest', desc:'Square Feet of Forest', icon:'pine-tree', color:'#228B22',value:30},
      { key:'co2', desc:'Pounds of Co2', icon:'car-hatchback', color:'#A9A9A9',value:20},
      { key:'animals', desc:"Animal's Life", icon:'pig', color:'#FFC0CB',value:1},
    ];
  } else {
    liquid="litres";
    solid="kilograms";
    volume = "meters";
    perDayArray = [
      { key:'water', desc:'Litres of Water', icon:'cup-water', color:'#00F', value:4164},
      { key:'grain', desc:'Kilograms of Grain', icon:'barley', color:'#f5deb3',value:18},
      { key:'forest', desc:'Square Meters of Forest', icon:'pine-tree', color:'#228B22',value:3},
      { key:'co2', desc:'Kilograms of Co2', icon:'car-hatchback', color:'#A9A9A9',value:9},
      { key:'animals', desc:"Animal's Life", icon:'pig', color:'#FFC0CB',value:1},
    ];
  }



  addToNotificationArray(notificationArray, "Water", "Environmental Milestone", "You have saved [#] " + liquid + " of water by being vegan!", 100000, stats[0], perDayArray[0].value, function(notificationArray) {
    addToNotificationArray(notificationArray, "Grain", "Environmental Milestone", "You have saved [#] " + solid + " of grain by being vegan!", 10000, stats[1], perDayArray[1].value, function(notificationArray) {
      addToNotificationArray(notificationArray, "Forest", "Environmental Milestone", "You have saved [#] square " + volume + " of forest by being vegan!", 10000, stats[2], perDayArray[2].value, function(notificationArray) {
        addToNotificationArray(notificationArray, "Co2", "Environmental Milestone", "You have saved [#] " + solid + " of Co2 by being vegan!", 10000, stats[3], perDayArray[3].value, function(notificationArray) {
          addToNotificationArray(notificationArray, "Animals", "Compassion Milestone", "You have saved [#] animals' lives by being vegan!", 100, stats[4], perDayArray[4].value, function(notificationArray) {
            addToNotificationArrayAnniversary(notificationArray, "Days", "Well done!", "You have been vegan for [#] days! You can do it!", startDateSQL, notificationCountDays, "Days", function(notificationArray) {
              addToNotificationArrayAnniversary(notificationArray, "Weeks", "Congratulations!", "You have been vegan for [#] weeks! Going strong!", startDateSQL, notificationCountWeeks, "Weeks", function(notificationArray) {
                addToNotificationArrayAnniversary(notificationArray, "Months", "Amazing!", "You have been vegan for [#] months! Keep it up!", startDateSQL, notificationCountMonths, "Months", function(notificationArray) {
                  addToNotificationArrayAnniversary(notificationArray, "Anniversary", "Happy Veganniversary!", "You have been vegan for [#] years! Simply amazing!", startDateSQL, notificationCountYears, "Years", function(notificationArray) {
                    //console.log("Final array:");
                    //console.log(notificationArray);
                    callback(notificationArray);

                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

function addToNotificationArray(notificationArray, nKey, nTitle, nDesc, significant, item, amountPerDay, callback) {
  //console.log("addToNotificationArray: " + nTitle);
  var value = item.value;
  var targetValue = Math.floor(value / significant) * significant;
  var targetDate;
  var i;
  var newDesc;
  var smallIcon = "ic_" + item.icon;
  var now = new Date();
  now.setHours(0, 0, 0, 0)

  for (i=0; i<notificationCount; i++) {
    targetValue = targetValue + significant; //increase by each significant amount
    //find the date when the person will reach the target
    targetDate = dateTargetReached(amountPerDay, value, targetValue);
    //set a notification
    if (targetDate) {
        if (targetDate > now) {
          newDesc = nDesc.replace("[#]", numberWithCommas(targetValue));
          notificationArray.push({key: nKey + i, title: nTitle, desc: newDesc, smallIcon: smallIcon, fireDate: targetDate});
        }
    }
  }
  callback(notificationArray);
}

function addToNotificationArrayAnniversary(notificationArray, nKey, nTitle, nDesc, startDateSQL, nCount, nType, callback) {
  //console.log("addToNotificationArrayAnniversary: " + nTitle);
  var targetDate;
  var i;
  var newDesc;
  var startDate = new Date(startDateSQL);
  var newDate;
  var smallIcon;
  var now = new Date();
  now.setHours(0, 0, 0, 0)

  startDate.setDate(startDate.getDate() + 1); //sql seems to lose a day
  //console.log("startDate: ");
  //console.log(startDate);
  //avoid sending notifications in the middle of the night
  if (startDate.getHours() < 10) {
    startDate.setHours(10);
  } else if (startDate.getHours() > 20) {
    startDate.setHours(20);
  }

  var iAdded =0;
  var addIt = function(nKey, nTitle, newDesc, smallIcon, fireDate, now, callback) {
    //console.log("fireDate:");
    //console.log(fireDate);
    if (fireDate > now) {
      notificationArray.push({key: nKey + i, title: nTitle, desc: newDesc, smallIcon: smallIcon, fireDate: fireDate});
    }
    callback();
  }

  for (i=0; i<nCount; i++) {
    newDate = new Date(startDate.getTime());

    switch(nType) {
      case "Days":
        newDate.setDate(startDate.getDate() + (i + 1));
        smallIcon = "ic_calendar";
        break;
      case "Weeks":
        newDate.setDate(startDate.getDate() + ((i + 1) * 7));
        smallIcon = "ic_calendar";
        break;
      case "Months":
        newDate.setMonth(startDate.getMonth() + (i + 1));
        smallIcon = "ic_calendar";
        break;
      case "Years":
        newDate.setFullYear(startDate.getFullYear() + (i + 1));
        smallIcon = "ic_cake";
        break;
    }


    //set a notification
    newDesc = nDesc.replace("[#]", i + 1);
    if (i === 0) {
      //remove plurals if the number is singular
      newDesc = newDesc.replace("s!", "!");
    }

    addIt(nKey, nTitle, newDesc, smallIcon, newDate, now, function() {
      iAdded ++;
      //console.log(iAdded);
      if (iAdded === nCount) {
        //console.log("beforecallback");
        //console.log(notificationArray);
        callback(notificationArray);
      }
    });

  }
  if (nCount === 0) {
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
      metric: navigation.getParam('metric'),
    };
  }

  _doCancelNotifications(callback) {
    //this used to iterate through notifications before I realized there was a cancelAll function
    //so the callback is legacy
    PushNotification.cancelAllLocalNotifications();
    callback();
  }


  _doNotifications(stats, date) {
    //console.log("do notifications");
    //first, clear any old notifications so we don't get dupliates

    if (date) {
      if (date !== "") {
        this._doCancelNotifications(function() {
          futureStats(stats, date, function(notificationArray) {
            //now we should have an array of notifications
            //console.log(notificationArray);
            var i;
            var l = notificationArray.length;
            var notification;

            for (i=0;i<l;i++) {
                notification = notificationArray[i];
                PushNotification.localNotificationSchedule({
                    /* Android Only Properties */
                    id: i.toString, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
                    //ticker: "My Notification Ticker", // (optional)
                    //autoCancel: true, // (optional) default: true
                    //largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
                    smallIcon: notification.smallIcon, // (optional) default: "ic_notification" with fallback for "ic_launcher"
                    //bigText: , // (optional) default: "message" prop
                    //subText: "This is a subText", // (optional) default: none
                    //color: "red", // (optional) default: system default
                    //vibrate: true, // (optional) default: true
                    //vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                    //tag: 'some_tag', // (optional) add tag to message
                    //group: "group", // (optional) add group to message
                    //ongoing: false, // (optional) set whether this is an "ongoing" notification
                    //priority: "high", // (optional) set notification priority, default: high
                    //visibility: "private", // (optional) set notification visibility, default: private
                    //importance: "high", // (optional) set notification importance, default: high

                    /* iOS only properties */
                    //alertAction: // (optional) default: view
                    //category: // (optional) default: null
                    userInfo: { id: i.toString },// (optional) default: null (object containing additional notification data)

                    /* iOS and Android properties */
                    title: notification.title, // (optional)
                    message: notification.desc, // (required)
                    playSound: true, // (optional) default: true
                    soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
                    //number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
                    //repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
                    //actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
                    date: notification.fireDate
                });


            }
            Alert.alert(
              'Notifications Enabled',
              'You can disable these notifications at any time.',
              [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            )
          });
        });
      } else {
        this._warnAboutDate();
      }
    } else {
      this._warnAboutDate();
    }
  }

  _warnAboutDate() {
    Alert.alert(
      'Choose a date first',
      'Please enter the date you went vegan before enabling notifications',
      [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }

  _doNotificationsOff(stats, date) {
    //console.log("do notifications off");
    if (date) {
      if (date !== "") {
        this._doCancelNotifications(function() {
          Alert.alert(
            'Notifications Disabled',
            'All future notifications from this app have been disabled.',
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
        });
      }
    }
  }

  _doNotificationsTest() {
    //console.log("do notifications test");
    var myDate = new Date()
    myDate.setSeconds(myDate.getSeconds() + 10);

    PushNotification.localNotificationSchedule({
        /* Android Only Properties */
        //id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
        //ticker: "My Notification Ticker", // (optional)
        //autoCancel: true, // (optional) default: true
        //largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
        smallIcon: "ic_cake", // (optional) default: "ic_notification" with fallback for "ic_launcher"
        //bigText: , // (optional) default: "message" prop
        //subText: "This is a subText", // (optional) default: none
        //color: "red", // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        //tag: 'some_tag', // (optional) add tag to message
        //group: "group", // (optional) add group to message
        //ongoing: false, // (optional) set whether this is an "ongoing" notification
        //priority: "high", // (optional) set notification priority, default: high
        //visibility: "private", // (optional) set notification visibility, default: private
        //importance: "high", // (optional) set notification importance, default: high

        /* iOS only properties */
        //alertAction: // (optional) default: view
        //category: // (optional) default: null
        //userInfo: // (optional) default: null (object containing additional notification data)

        /* iOS and Android properties */
        title: "This is a test", // (optional)
        message: "Testing, testing, 1, 2, 3", // (required)
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        //number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        //repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
        //actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
        date: myDate
    });
  }

  render() {

      return (
      <View>
        <ScrollView>
        <View style={styles.container}>
        <Text style={styles.normal}>If you have recently gone vegan, VeganStats will send motivational reminders about the number of days, weeks and months you have been vegan.</Text>
        <Text style={styles.normal}>If you have been vegan longer, VeganStats will send notifications on the anniversary of the day you went vegan, as well as certain environmental and compassionate milestones that you have reached.</Text>
        <Text style={styles.normal}>You can expect about 20 notifications in the first year you are vegan, and 10 per year thereafter.</Text>

        <TurnOnButton
        onPress={() => this._doNotifications(this.state.stats, this.state.date, this.state.metric)}
        />
        <TurnOffButton
        onPress={() => this._doNotificationsOff(this.state.stats, this.state.date)}
        />
        {
        /* disable on live
        <TestButton
        onPress={this._doNotificationsTest}
        />
        */
        }
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
