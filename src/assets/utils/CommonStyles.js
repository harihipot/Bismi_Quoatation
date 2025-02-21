import {Platform, StyleSheet} from 'react-native';
import Colors from '../Colors';

export const CommonStyles = StyleSheet.create({
  addButtonStyle: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: Colors.greenColor,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  plusStyle: {
    width: 24,
    height: 24,
  },
  buttonContainerStyle: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
  },
  addStyle: {
    fontSize: 16,
    backgroundColor: Colors.greenColor,
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  tabIconStyle: {
    width: 20,
    height: 20,
  },
  containerStyle: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingTop: 10,
  },
  emptyStyle: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLableStyle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: '10%',
    color: Colors.greenColor,
  },
  tabIconContainerStyle: {
    backgroundColor: Colors.greenColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 34,
    borderRadius: 16,
  },
  tabBarContainerStyle: {
    height: Platform.OS === 'ios' ? 120 : 66,
  },
  emptyTextStyle: {
    fontSize: 18,
    color: Colors.greenColor,
  },
  containerRowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  imageStyle: {
    width: 24,
    height: 24,
    marginRight: 20,
    resizeMode: 'contain',
  },
});
