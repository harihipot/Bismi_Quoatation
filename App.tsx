import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import SQLite from './src/assets/utils/SQLite';
import {StatusBar} from 'react-native';
import Colors from './src/assets/Colors';

const App = () => {
  useEffect(() => {
    try {
      SQLite.createCutomerTable();
      SQLite.createProductTable();
    } catch (e) {
      console.log('error', JSON.stringify(e));
    }
  }, []);
  return (
    <>
      <StatusBar backgroundColor={Colors.greenColor} translucent={false} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};

export default App;
