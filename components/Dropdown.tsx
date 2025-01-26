import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Dropdown() {
  return (
    <View style={styles.container}>
      <Text>Dropdown</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "dodgerblue",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})