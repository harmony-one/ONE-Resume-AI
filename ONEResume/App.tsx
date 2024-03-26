import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import UploadScreen from './src/uploadScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#404040', // Set the background color of the header
          },
          headerTintColor: '#fff', // Set the color of the header text and icons
          headerTitleStyle: {
            fontWeight: 'bold', // Set the font weight of the title
            fontSize: 20, // Set the font size of the title
            // fontFamily: 'YourCustomFont', // Uncomment and set your custom font if you have one
          },
        }}>
        <Stack.Screen
          name="ONE Resume: AI for Job Matching"
          component={UploadScreen}
        />
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
