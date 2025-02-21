import {createStackNavigator} from '@react-navigation/stack';
import BottomNavigator from './BottomNavigator';

const Stack = createStackNavigator();

export default RootStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={'bottom'}
      screenOptions={{
        gestureEnabled: false,
      }}>
      <Stack.Screen
        name={'bottom'}
        component={BottomNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
