import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SQLite from './src/assets/utils/SQLite';
import {StatusBar} from 'react-native';
import Colors from './src/assets/Colors';
import BottomNavigator from './src/navigation/BottomNavigator';

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
        <BottomNavigator />
      </NavigationContainer>
    </>
  );
};

export default App;
