import { StatusBar, StyleSheet, useColorScheme, View, TouchableOpacity, Text, TextInput } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { getBatteryLevel } from 'react-native-battery-level';
import { useEffect, useState } from 'react';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [batteryLevel, setBatteryLevel] = useState<number>(0);

  useEffect(() => {
    getBatteryLevel().then(level => {
      setBatteryLevel(level);
    }).catch(error => {
      console.error('Error getting battery level:', error);
    });
  }, [])

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10, marginBottom: 10 }}>
        <Text style={{color: 'white'}}>Click me </Text>
      </TouchableOpacity>
      <Text testID="battery_level">当前电量：{batteryLevel}</Text>
      <Text testID="welcome">welcome</Text>
      <TextInput placeholder="Enter text here" style={{borderWidth: 1, borderColor: 'gray'}} testID="text_input" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100
  },
});

export default App;
