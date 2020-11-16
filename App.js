import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/containers/HomeScreen.js';
import EditRecordsScreen from './src/containers/EditRecordsScreen.js';
import TrackScreen from './src/containers/TrackScreen.js';

const Stack = createStackNavigator();
class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            name="Edit"
            component={EditRecordsScreen}
          />
          <Stack.Screen
            name="Track"
            component={TrackScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}


export default App;