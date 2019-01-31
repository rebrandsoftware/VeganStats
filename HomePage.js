'use strict';

import React, {Component} from 'react';
import { Alert, AsyncStorage, Button, FlatList, Image, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RatingRequester from 'rn-rating-requester';
import SplashScreen from 'react-native-splash-screen';
import Switch from './MySwitch.js'

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

const TextButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.textButton}
      onPress={props.onPress}
    >
      <Text style={styles.textButtonText}>Sources</Text>
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

function daysFromSeconds(seconds) {
  return Math.round(seconds / 86400);
}

function textPlainFromArray(stats, date, days) {
  var ret = "Being vegan since " + date; + " (" + days + " days) saved ";
  var key;
  ret += numberWithCommas(stats[0].value) + " " + stats[0].desc + ", ";
  ret += numberWithCommas(stats[1].value) + " " + stats[1].desc + ", ";
  ret += numberWithCommas(stats[2].value) + " " + stats[2].desc + ", ";
  ret += numberWithCommas(stats[3].value) + " " + stats[3].desc + ", and";
  ret += numberWithCommas(stats[4].value) + " " + stats[4].desc + ".";
  return ret
}

function statsFromSeconds(seconds, metric) {
  var perDayArray;
  console.log("StatsFromSeconds metric: " + metric);

  if (metric == false) {
    perDayArray = [
      { key:'water', desc:'Gallons of Water', icon:'cup-water', color:'#00F', value:1100},
      { key:'grain', desc:'Pounds of Grain', icon:'barley', color:'#f5deb3',value:40},
      { key:'forest', desc:'Square Feet of Forest', icon:'pine-tree', color:'#228B22',value:30},
      { key:'co2', desc:'Pounds of Co2', icon:'car-hatchback', color:'#A9A9A9',value:20},
      { key:'animals', desc:"Animal's Life", icon:'pig', color:'#FFC0CB',value:1},
    ];
  } else {
    perDayArray = [
      { key:'water', desc:'Litres of Water', icon:'cup-water', color:'#00F', value:4164},
      { key:'grain', desc:'Kilograms of Grain', icon:'barley', color:'#f5deb3',value:18},
      { key:'forest', desc:'Square Meters of Forest', icon:'pine-tree', color:'#228B22',value:3},
      { key:'co2', desc:'Kilograms of Co2', icon:'car-hatchback', color:'#A9A9A9',value:9},
      { key:'animals', desc:"Animal's Life", icon:'pig', color:'#FFC0CB',value:1},
    ];
  }

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
    title: 'VeganStats',
  };

  constructor(props){
    super(props)
    this.state = {
      date: null,
      days: 0,
      metric: false,
      timeoutId: null,
      calculated: false,
      textPlain: '',
      textReddit: '',
      textHTML: '',
      amountSavedArray: [
        { key:'water', desc:'Gallons of Water', icon:'cup-water', color:'#00F', value:1100}, //4164 liters
        { key:'grain', desc:'Pounds of Grain', icon:'barley', color:'#f5deb3',value:40}, //18 kg
        { key:'forest', desc:'Square Feet of Forest', icon:'pine-tree', color:'#228B22',value:30}, //3 square meters
        { key:'co2', desc:'Pounds of Co2', icon:'car-hatchback', color:'#A9A9A9',value:20}, //9kg
        { key:'animals', desc:"Animal's Life", icon:'pig', color:'#FFC0CB',value:1},  //1 life
      ],
      amountSavedArrayImperial: [
        { key:'water', desc:'Gallons of Water', icon:'cup-water', color:'#00F', value:1100}, //4164 liters
        { key:'grain', desc:'Pounds of Grain', icon:'barley', color:'#f5deb3',value:40}, //18 kg
        { key:'forest', desc:'Square Feet of Forest', icon:'pine-tree', color:'#228B22',value:30}, //3 square meters
        { key:'co2', desc:'Pounds of Co2', icon:'car-hatchback', color:'#A9A9A9',value:20}, //9kg
        { key:'animals', desc:"Animal's Life", icon:'pig', color:'#FFC0CB',value:1},  //1 life
      ],
      amountSavedArrayMetric: [
        { key:'water', desc:'Litres of Water', icon:'cup-water', color:'#00F', value:4164},
        { key:'grain', desc:'Kilograms of Grain', icon:'barley', color:'#f5deb3',value:18},
        { key:'forest', desc:'Square Meters of Forest', icon:'pine-tree', color:'#228B22',value:3},
        { key:'co2', desc:'Kilograms of Co2', icon:'car-hatchback', color:'#A9A9A9',value:9},
        { key:'animals', desc:"Animal's Life", icon:'pig', color:'#FFC0CB',value:1},
      ]
    };



  };

  componentDidMount() {

    SplashScreen.hide();



    AsyncStorage.getItem("date").then((date) => {
      AsyncStorage.getItem("metric").then((metric) => {
        //console.log("date from AsyncStorage: " + value);
        if (metric !== null) {
          metric = JSON.parse(metric);
        } else {
          metric = false;
        }

        if (metric == true) {
          this.setState({amountSavedArray: this.state.amountSavedArrayMetric});
        } else {
          this.setState({amountSavedArray: this.state.amountSavedArrayImperial});
        }

        this.setState({metric: metric});
        if (date) {
          this.setState({date: date});
          console.log("from loading");
          this._onDateChanged(date, metric);
        }
      }).done();
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

  _onMetricChanged = (value) => {
      this.setState({metric: value});
      console.log('Metric changed: ' + value);
      this._onDateChanged(null, value);
   }

  _onPressItem = (index) => {
    //console.log("Pressed " + index);

  };

  _onDateChanged = (date, metric) => {
    console.log("Date changed " + date + " metric: " + metric);
    if (!date) {
      date = this.state.date;
      //console.log("using saved date: " + date);
    }

    if (date !== null && date !== undefined) {



      if (metric === null || metric === undefined) {
        console.log("not metric: " + metric);
        metric = this.state.metric;
        console.log("after: " + metric);

      }

      var seconds = secondsFromStartDate(date);
      //console.log("seconds: " + seconds);
      var stats = statsFromSeconds(seconds, metric);
      var days = daysFromSeconds(seconds);
      var sTextPlain = textPlainFromArray(stats, date, days);

      this.setState({ date: date });
      this.setState({ calculated: true });
      this.setState({ amountSavedArray: stats });
      this.setState({ days: days});
      this.setState({ textPlain: sTextPlain});
      AsyncStorage.setItem("date", date);
      AsyncStorage.setItem("metric", JSON.stringify(metric));
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
    } else {
      if (metric == true) {
        this.setState({amountSavedArray: this.state.amountSavedArrayMetric});
      } else {
        this.setState({amountSavedArray: this.state.amountSavedArrayImperial});
      }
    }
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
      <Text style={styles.header}>Being vegan for {numberWithCommas(this.state.days)} days saved:</Text> : <Text style={styles.header}>Each day, eating a vegan diet saves:</Text>;
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
                console.log("from on date change");
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

          <View style={styles.metricContainer}>
            <View style={styles.metricCol1} >
                <Text style={styles.metricLabel}>Metric:</Text>
            </View>
            <View style={styles.metricCol2} >
              <MySwitch
              onMetricChanged = {this._onMetricChanged}
              metric = {this.state.metric}/>
            </View>
          </View>

            <NotificationsButton
            onPress={() => navigate('Notifications', {date: this.state.date, stats: this.state.amountSavedArray, metric: this.state.metric})}
            />
            <TextButton
            onPress={() => navigate('Text', {date: this.state.date, stats: this.state.amountSavedArray, metric: this.state.metric})}
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
  metricContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  metricCol1: {
    width: "75%"
  },
  metricCol2: {
    width: "25%"
  },
  metricLabel: {
    fontSize: 15,
    textAlign: 'right'
  },
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
  }
});
