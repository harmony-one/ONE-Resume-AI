import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UploadScreen from './src/uploadScreen';
import codePush from 'react-native-code-push';
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, ActivityIndicator } from 'react-native';
import ChatScreen from './src/chatScreen';
import FileChatScreen from './src/fileChatScreen';

const Stack = createStackNavigator();
let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
  updateDialog: true,
};


const App = () => {
  useEffect(() => {
    codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE,
      },
      codePushStatusDidChange,
    );
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#00AEE9', // Set the background color of the header
          },
          headerTintColor: '#fff', // Set the color of the header text and icons
          headerTitleStyle: {
            fontFamily: 'YourCustomFont', // Uncomment and set your custom font if you have one
          },
        }}
        // initialRouteName="ONE Resume: AI for Job Matching" // Ensure this matches the name of the initial screen
        initialRouteName="FileChatScreen"
      >
        <Stack.Screen name="ONE Resume: AI for Job Matching" component={UploadScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="FileChatScreen" component={FileChatScreen} options={{ title: 'ONE Resume: AI' }} />
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function codePushStatusDidChange(syncStatus) {
  switch (syncStatus) {
    case codePush.SyncStatus.CHECKING_FOR_UPDATE:
      console.log("Checking for update.")
      break;
    case codePush.SyncStatus.DOWNLOADING_PACKAGE:
      console.log("Download packaging....")
      break;
    case codePush.SyncStatus.AWAITING_USER_ACTION:
      console.log("Awaiting user action....")
      break;
    case codePush.SyncStatus.INSTALLING_UPDATE:
      console.log("Installing update")
      break;
    case codePush.SyncStatus.UP_TO_DATE:
      console.log("codepush status up to date")
      break;
    case codePush.SyncStatus.UPDATE_IGNORED:
      console.log("update cancel by user")
      break;
    case codePush.SyncStatus.UPDATE_INSTALLED:
      console.log("Update installed and will be applied on restart.")
      break;
    case codePush.SyncStatus.UNKNOWN_ERROR:
      console.log("An unknown error occurred")
      break;
  }
}

export default codePush(codePushOptions)(App);

