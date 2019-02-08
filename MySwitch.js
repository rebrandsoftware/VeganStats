import React, { Component } from 'react'
import { View, Switch, StyleSheet } from 'react-native'

export default MySwitch = (props) => {
   return (
      <View style = {styles.container}>
         <Switch
         onValueChange = {props.onMetricChanged}
         value = {props.metric}/>
      </View>
   )
}
const styles = StyleSheet.create ({
   container: {
      flex: 1,
      alignItems: 'center'
   }
})
