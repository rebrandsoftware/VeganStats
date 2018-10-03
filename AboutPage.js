'use strict';

import React, {Component} from 'react';
import { Image, StyleSheet, Text, Linking, View, ScrollView } from 'react-native';

export default class AboutPage extends Component<{}> {
  static navigationOptions = {
    title: 'About Mike Gibson',
  };

  render() {
    return (
      <View>
        <ScrollView>
        <View style={styles.container}>
        <Image
          style={styles.profile}
          source={require('./img/Mountains.png')}
        />
        <Text style={styles.normal}>I am a <Text style={styles.link} onPress={() => Linking.openURL('http://www.MikeGibson.work')}>freelance software developer</Text> that has been vegan since January 8, 2017.</Text>
        <Text style={styles.normal}>I created this free, <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/rebrandsoftware/VeganStats')}>open source</Text> React Native app to help other vegans envision the positive benefits of their lifestyle and to provide incentives for all people to consider a vegan diet.</Text>
        <Text style={styles.normal}>If you are interested in creating your own app you can hire me at <Text style={styles.link} onPress={() => Linking.openURL('http://www.MikeGibson.work')}>MikeGibson.work</Text>.</Text>
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
  profile: {
    alignSelf: 'center',
    width: '90%',
    marginBottom: 35
  },
  link: {
    color: 'blue',
  },
  normal: {
    fontSize: 16,
    color: '#000',
    marginBottom: 35
  }
});
