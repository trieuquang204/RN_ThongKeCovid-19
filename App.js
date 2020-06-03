/***
/*  Made with Love
/*  Hasan Aydın ©
/*  www.hasanaydins.com
/***/

import 'react-native-gesture-handler';

import * as React from 'react';

import {SafeAreaView} from 'react-native';
import {ThemeProvider} from 'styled-components';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

import Box from './src/components/Base/Box';
import TabBar from './src/components/TabBar';
import HomeStackScreen from './src/screens/Home';
import SearchStackScreen from './src/screens/Search';
import Theme from './src/utils/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Box flex={1} as={SafeAreaView}>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName='Home'
            tabBar={props => <TabBar {...props} />}
          >
            <Tab.Screen name='Home' component={HomeStackScreen} />
            <Tab.Screen name='Search' component={SearchStackScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </Box>
    </ThemeProvider>
  );
}
