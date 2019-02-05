'use strict';

import React, {Component} from 'react';
import { Alert, AsyncStorage, Button, FlatList, Image, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RatingRequester from 'rn-rating-requester';
import SplashScreen from 'react-native-splash-screen';

const RatingOptions = {
    enjoyingMessage: "Are you enjoying this app?",
    enjoyingActions: {
      accept: "Yes, I love it!",
      decline: "No, thanks.",
    },
    callbacks: {
      notEnjoyingApp: doNotEnjoyingApp,
    },
    title: "Help With A Review?",
    message: "If you have a moment to leave a positive review for this free app it would be very much appreciated!",
    actionLabels: {
      decline: "Never",
      delay: "Later",
      accept: "Review Now"
    },
    eventsUntilPrompt: 3,
    daysBeforeReminding: 3,
    debug: false,
  }

const RatingTracker = new RatingRequester("1438134503", "com.rebrandsoftware.veganstats", RatingOptions);

class ListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.index);
  }

  render() {
    const item = this.props.item;
    //console.log("item:");
    //console.log(item);
    return (
      <TouchableHighlight
        onPress={this._onPress}
        underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <Icon name={item.icon} size={50} color={item.color} style={styles.thumb} />
            <View style={styles.textContainer}>
              <Text style={styles.listItem}>{numberWithCommas(item.value)} {item.desc}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }
}

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const AboutButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.aboutButton}
      onPress={props.onPress}
    >
      <Text style={styles.aboutButtonText}>About</Text>
    </TouchableOpacity>
  );
};

const SourcesButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.sourcesButton}
      onPress={props.onPress}
    >
      <Text style={styles.sourcesButtonText}>Sources</Text>
    </TouchableOpacity>
  );
};

const NotificationsButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.notificationsButton}
      onPress={props.onPress}
    >
      <Text style={styles.notificationsButtonText}>Notifications</Text>
    </TouchableOpacity>
  );
};

function doNotEnjoyingApp() {
  Alert.alert(
    'Sorry to hear that!',
    'Please email me directly at mike@rebrandsoftware.com if you need help or have feedback.',
    [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    { cancelable: false }
  )
}

function statsFromSeconds(seconds) {
  var perDayArray = [
    { key:'water', desc:'Gallons of Water', icon:'cup-water', color:'#00F', value:1100},
    { key:'grain', desc:'Pounds of Grain', icon:'barley', color:'#f5deb3',value:40},
    { key:'forest', desc:'Square Feet of Forest', icon:'pine-tree', color:'#228B22',value:30},
    { key:'co2', desc:'Pounds of Co2', icon:'car-hatchback', color:'#A9A9A9',value:20},
    { key:'animals', desc:"Animal's Life", icon:'pig', color:'#FFC0CB',value:1},
  ];

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
  //startDate.setDate(startDate.getDate() + 1); //sql seems to lose a day
  var endDate = new Date();
  return Math.round((endDate.getTime() - startDate.getTime()) / 1000);
}

export default class HomePage extends Component<{}> {
  static navigationOptions = {
    title: 'Vegan Stats',
  };

  constructor(props){
    super(props)
    this.state = {
      date: '',
      timeoutId: null,
      calculated: false,
      amountSavedArray: [
        { key:'water', desc:'Gallons of Water', icon:'cup-water', color:'#00F', value:1100},
        { key:'grain', desc:'Pounds of Grain', icon:'barley', color:'#f5deb3',value:40},
        { key:'forest', desc:'Square Feet of Forest', icon:'pine-tree', color:'#228B22',value:30},
        { key:'co2', desc:'Pounds of Co2', icon:'car-hatchback', color:'#A9A9A9',value:20},
        { key:'animals', desc:"Animal's Life", icon:'pig', color:'#FFC0CB',value:1},
      ],
    };
  };

  componentDidMount() {

    SplashScreen.hide();

    AsyncStorage.getItem("date").then((value) => {
        //console.log("date from AsyncStorage: " + value);
        if (value) {
          this.setState({"date": value});
          this._onDateChanged(value);
        }
    }).done();

    //each time the user opens the app for 15 seconds, increment the RatingRequestor
    setTimeout(
      () => RatingTracker.handlePositiveEvent(function(didAppear, userDecision) {
    		if (didAppear) {
    			switch(userDecision)
    			{
    				case 'decline': console.log('User declined to rate'); break;
    				case 'delay'  : console.log('User delayed rating, will be asked later'); break;
    				case 'accept' : console.log('User accepted invitation to rate, redirected to app store'); break;
    			}
    		} else {
    			console.log('Request popup did not pop up. May appear on future positive events.');
    		}
    	}),
      15000
    )

  };



  _keyExtractor = item => item.key;

  _renderItem = ({item, index}) => (
    <ListItem
      item={item}
      index={index}
      onPressItem={this._onPressItem}
    />
  );

  _onPressItem = (index) => {
    //console.log("Pressed " + index);

  };

  _onDateChanged = (date) => {
    //console.log("Date changed " + date);
    if (!date) {
      date = this.state.date;
      //console.log("using saved date: " + date);
    }

    var seconds = secondsFromStartDate(date);
    //console.log("seconds: " + seconds);
    var stats = statsFromSeconds(seconds);
    this.setState({ date: date });
    this.setState({ calculated: true });
    this.setState({ amountSavedArray: stats });
    AsyncStorage.setItem("date", date);
    //console.log(stats);
    //this.setState({ searchString: date });
    //await AsyncStorage.setItem('date', date);
    var timeoutId;
    if (this.state.timeoutId) {
      //console.log("timeoutId: " + this.state.timeoutId);
      clearTimeout(this.state.timeoutId);
      this.setState({ timeoutId: null});
      //console.log("cleared timeout");
    }

    timeoutId = setTimeout(this._onDateChanged, 60000);
    this.setState({ timeoutId: timeoutId });

  };

  _bannerError = (error) => {
    //console.log("Error");
    //console.log(error);
  };


  // statsFromSeconds = (seconds) => {
  //   perDayArray.map(obj =>{
  //      var rObj = {};
  //      rObj[obj.name] = ((obj.value / 86400) * seconds).toFixed(2);
  //      return rObj;
  //   });
  // };

  render() {
     const { navigate } = this.props.navigation;
    const header = this.state.calculated ?
      <Text style={styles.header}>Being vegan since {this.state.date} saved:</Text> : <Text style={styles.header}>Each day, eating a vegan diet saves:</Text>;
    //console.log("this.state:");
    //console.log(this.state);
    return (
      <View>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>When did you go vegan?</Text>
            <DatePicker
              style={{width: 300}}
              date={this.state.date}
              mode="date"
              placeholder="Select a date"
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {
                this.setState({date: date});
                this._onDateChanged(date);
              }}
            />
          </View>
          <View style={styles.centerContainer}>
            {header}
          </View>

          <FlatList
            data={this.state.amountSavedArray}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
          <View style={styles.centerContainer}>
            <NotificationsButton
            onPress={() => navigate('Notifications', {date: this.state.date, stats: this.state.amountSavedArray})}
            />
            <SourcesButton
            onPress={() => navigate('Source')}
            />
            <AboutButton
            onPress={() => navigate('About')}
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
    alignItems: 'center',
  },
  centerContainer: {
    padding: 10,
    alignItems: 'center',
  },
  thumb: {
    marginRight: 15
  },
  listView: {
    flex: 1
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  title: {
    fontSize: 25,
    color: '#000',
    marginBottom: 15,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 35,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 18,
    color: '#000',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 2,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
  },
  aboutButton: {
    width: '100%',
    backgroundColor: '#74B900',
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutButtonText: {
    fontSize: 20,
    color: 'white',
  },
  sourcesButton: {
    width: '100%',
    backgroundColor: '#27A5EB',
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourcesButtonText: {
    fontSize: 20,
    color: 'white',
  },
  notificationsButton: {
    width: '100%',
    backgroundColor: '#FD78FF',
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsButtonText: {
    fontSize: 20,
    color: 'black',
  },
});
