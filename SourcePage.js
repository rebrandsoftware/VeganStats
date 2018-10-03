'use strict';

import React, {Component} from 'react';
import { Image, Linking, StyleSheet, Text, View, ScrollView } from 'react-native';

export default class SourcePage extends Component<{}> {
  static navigationOptions = {
    title: 'Sources',
  };

  render() {
    return (
      <View>
        <ScrollView>
          <View style={styles.container}>
              <Text style={styles.normal}>
                This app was inspired by the documentary <Text style={styles.link} onPress={() => Linking.openURL('http://www.cowspiracy.com')}>Cowspiracy</Text>.  They maintain a <Text style={styles.link} onPress={() => Linking.openURL('http://www.cowspiracy.com/facts/')}>Facts Page</Text> with many good citations.  For this app we focus on:
              </Text>

              <Text style={styles.normalBig}>
                Each day, a person who eats a vegan diet saves 1,100 gallons of water, 45 pounds of grain, 30 sq ft of forested land, 20 lbs CO2 equivalent, and one animal&#39;s life.
              </Text>

              <Text style={styles.normal}>
                <Text style={styles.link} onPress={() => Linking.openURL('http://link.springer.com/article/10.1007/s10584-014-1169-1/fulltext.html')}>
                Scarborough, Peter, et al. &quot;Dietary greenhouse gas emissions of meat-eaters, fish-eaters, vegetarians and vegans in the UK&quot;. Climactic Change July 2014., Volume 125, Issue 2, pp 179-192
                </Text>
              </Text>

              <Text style={styles.normal}>
                <Text style={styles.link} onPress={() => Linking.openURL('http://static.ewg.org/reports/2011/meateaters/pdf/methodology_ewg_meat_eaters_guide_to_health_and_climate_2011.pdf')}>
                  &quot;Meat Eater&#39;s Guide to Climate Change and Health&quot;. Environmental Working Group. 2011
                </Text>
              </Text>

              <Text style={styles.normal}>
                <Text style={styles.link} onPress={() => Linking.openURL('http://www.wri.org/blog/2016/04/sustainable-diets-what-you-need-know-12-charts')}>
                  Ranganathan, Janet &amp; Waite, Richard. &quot;Sustainable Diets: What You Need to Know in 12 Charts&quot;. World Resources Institute. April 2016
                </Text>
              </Text>

              <Text style={styles.normal}>
                <Text style={styles.link} onPress={() => Linking.openURL('https://www.barnesandnoble.com/w/food-choice-and-sustainability-richard-a-oppenlander/1117327379?ean=9781626524354')}>
                  Oppenlander, Richard A. Food choice and Sustainability: Why Buying Local, Eating Less Meat, and Taking Baby Steps Won&#39;t Work. Minneapolis, MN : Langdon Street, 2013. Print.
                </Text>
              </Text>
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
  link: {
    color: 'blue',
  },
  normal: {
    fontSize: 16,
    color: '#000',
    marginBottom: 35
  },
  normalBig: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 35
  }
});
