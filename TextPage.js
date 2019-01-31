/*jshint esversion: 6 */

'use strict';

import React, {Component} from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import NotificationsIOS, { NotificationAction, NotificationCategory } from 'react-native-notifications';

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const RedditButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.redditButton}
      onPress={props.onPress}
    >
      <Text style={styles.redditButtonText}>Reddit</Text>
    </TouchableOpacity>
  );
};

const HTMLButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.htmlButton}
      onPress={props.onPress}
    >
      <Text style={styles.htmlButtonText}>HTML</Text>
    </TouchableOpacity>
  );
};

const PlainButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.plainButton}
      onPress={props.onPress}
    >
      <Text style={styles.plainButtonText}>Plain</Text>
    </TouchableOpacity>
  );
};

export default class TextPage extends Component<{}> {
  static navigationOptions = {
    title: 'Text',
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      activeText: navigation.getParam('plainText'),
      plainText: navigation.getParam('plainText'),
      redditText: navigation.getParam('redditText'),
      htmlText: navigation.getParam('htmlText'),
    };
  }

  _writeText(sType) {
    console.log("writeText: " + sType);

  }

  render() {

      return (
      <View>
        <ScrollView>
        <View style={styles.container}>
        <Text style={styles.normal}>Select a format to export your stats for sharing.</Text>

        <PlainButton
        onPress={() => this._writeText("Plain")}
        />

        <RedditButton
        onPress={() => this._writeText("Reddit")}
        />

        <HTMLButton
        onPress={() => this._writeText("HTML")}
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
