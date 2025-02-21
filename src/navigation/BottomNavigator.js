import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomersList from '../pages/customers/CustomersList';
import HomeScreen from '../pages/home/HomeScreen';
import ProductList from '../pages/products/ProductList';
import ProfilePage from '../pages/profile/ProfilePage';
import Images from '../assets/utils/Images';
import {Image, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddCustomers from '../pages/customers/AddCustomers';
import AddProducts from '../pages/products/AddProducts';
import {CommonStyles} from '../assets/utils/CommonStyles';
import Colors from '../assets/Colors';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default BottomNavigator = () => {
  const options = (label, headerTitle, activeImage, passiveImage, route) => {
    return {
      tabBarLabel: label,
      tabBarIcon: tabInfo => {
        return (
          <View
            style={
              tabInfo?.focused ? CommonStyles.tabIconContainerStyle : null
            }>
            <Image
              source={tabInfo?.focused ? activeImage : passiveImage}
              style={CommonStyles.tabIconStyle}
              resizeMode={'contain'}
            />
          </View>
        );
      },
      title: headerTitle,
      headerStyle: {
        height: 50,
        backgroundColor: Colors.greenColor,
      },
      headerTitleStyle: {
        color: Colors.white,
        fontSize: 20,
      },
      tabBarItemStyle: {display: 'flex', paddingVertical: 3},
      unmountOnBlur: true,
    };
  };

  const CustomerStack = () => {
    return (
      <Stack.Navigator initialRouteName="Customer">
        <Stack.Screen
          name="Customer"
          component={CustomersList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddCustomer"
          component={AddCustomers}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  };

  const ProductStack = () => {
    return (
      <Stack.Navigator initialRouteName="Product">
        <Stack.Screen
          name="Product"
          component={ProductList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddProduct"
          component={AddProducts}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: CommonStyles.tabBarContainerStyle,
        unmountOnBlur: true,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.greenColor,
        tabBarInactiveTintColor: Colors.greenColor,
        tabBarLabelStyle: CommonStyles.tabLableStyle,
      }}>
      <Tab.Screen
        name={'Home'}
        component={HomeScreen}
        options={({route}) =>
          options(
            'Home',
            'Bismi',
            Images.homeActive,
            Images.homeInactive,
            route,
          )
        }
      />
      <Tab.Screen
        name={'Customers'}
        component={CustomerStack}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            if (route.state && route.state.routeNames.length > 0) {
              navigation.navigate('Customers');
            }
          },
        })}
        options={({route}) =>
          options(
            'Customers',
            'Customers',
            Images.customerActive,
            Images.customerInactive,
            route,
          )
        }
      />
      <Tab.Screen
        name={'Products'}
        component={ProductStack}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            if (route.state && route.state.routeNames.length > 0) {
              navigation.navigate('Products');
            }
          },
        })}
        options={({route}) =>
          options(
            'Products',
            'Products',
            Images.productActive,
            Images.productInactive,
            route,
          )
        }
      />
      <Tab.Screen
        name={'Profile'}
        component={ProfilePage}
        options={({route}) =>
          options(
            'Profile',
            'Profile',
            Images.profileActive,
            Images.profileInactive,
            route,
          )
        }
      />
    </Tab.Navigator>
  );
};
