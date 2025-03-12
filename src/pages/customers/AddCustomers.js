import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Colors from '../../assets/Colors';
import {CommonStyles} from '../../assets/utils/CommonStyles';
import SQLite from '../../assets/utils/SQLite';
import TextInputComponent from '../../components/TextInputView';

export default AddCustomers = ({route, navigation}) => {
  const existingCustomer = route?.params?.customer;
  const [name, setName] = useState('');
  const [addressOne, setAddressOne] = useState('');
  const [addressTwo, setAddressTwo] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gstIn, setGstIn] = useState('');
  const [isError, setIsError] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (existingCustomer) {
      setName(existingCustomer.name);
      setAddressOne(existingCustomer.addressOne);
      setAddressTwo(existingCustomer.addressTwo);
      setCity(existingCustomer.city);
      setStateValue(existingCustomer.state);
      setPinCode(existingCustomer.pincode);
      setPhoneNumber(existingCustomer.phone);
      setGstIn(existingCustomer.gstNo);
    }
  }, [existingCustomer]);

  useEffect(() => {
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
    setKeyboardVisible(true);
  });
  const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', e => {
    setKeyboardVisible(false);
  });

  const onAddSuccess = () => {
    Alert.alert(
      'Success',
      existingCustomer
        ? 'Customer Updated Successfully'
        : 'Customer Add Successfully',
      [
        {
          text: 'ok',
          onPress: () => {
            navigation.pop();
            setName('');
            setAddressOne('');
            setAddressTwo('');
            setCity('');
            setStateValue('');
            setPinCode('');
            setPhoneNumber('');
            setGstIn('');
          },
        },
      ],
    );
  };

  const onAddError = error => {
    Alert.alert(
      'Error',
      existingCustomer
        ? 'Failed to update Customer, please Try again'
        : 'Failed to add Customer, please Try again',
    );
  };

  const addCustomers = () => {
    if (
      (name === '') |
      (addressOne === '') |
      (addressTwo === '') |
      (city === '') |
      (stateValue === '') |
      (pinCode === '') |
      (phoneNumber === '' || phoneNumber.length < 10) |
      (gstIn === '' || gstIn.length < 15)
    ) {
      setIsError(true);
    } else {
      const customer = {
        name: name,
        addressOne: addressOne,
        addressTwo: addressTwo,
        city: city,
        pincode: pinCode,
        state: stateValue,
        phone: phoneNumber,
        gstNo: gstIn,
      };
      if (existingCustomer) {
        SQLite.updateItemInTable(
          customer,
          existingCustomer,
          true,
          onAddSuccess,
          onAddError,
        );
      } else {
        SQLite.insertCustomers(customer, onAddSuccess, onAddError);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.containerStyle}
      keyboardVerticalOffset={Platform.select({
        ios: 20,
        android: 20,
      })}
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.contentStyle}
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}>
        <TextInputComponent
          placeholderText="Name *"
          textValue={name}
          onChange={text => {
            setName(text);
          }}
          returnKeyTypeProp="next"
          autoCapitalizeProp={'words'}
          errorMessage={isError && name === '' ? 'Enter the name' : null}
        />
        <TextInputComponent
          placeholderText="Addressline one *"
          textValue={addressOne}
          onChange={text => {
            setAddressOne(text);
          }}
          returnKeyTypeProp="next"
          autoCapitalizeProp={'words'}
          errorMessage={
            isError && addressOne === '' ? 'Enter the address one' : null
          }
        />
        <TextInputComponent
          placeholderText="Addressline Two *"
          textValue={addressTwo}
          onChange={text => {
            setAddressTwo(text);
          }}
          returnKeyTypeProp="next"
          autoCapitalizeProp={'words'}
          errorMessage={
            isError && addressTwo === '' ? 'Enter the address two' : null
          }
        />
        <TextInputComponent
          placeholderText="City *"
          textValue={city}
          onChange={text => {
            setCity(text);
          }}
          returnKeyTypeProp="next"
          autoCapitalizeProp={'words'}
          errorMessage={isError && city === '' ? 'Enter the city' : null}
        />
        <TextInputComponent
          placeholderText="State *"
          textValue={stateValue}
          onChange={text => {
            setStateValue(text);
          }}
          returnKeyTypeProp="next"
          autoCapitalizeProp={'words'}
          errorMessage={isError && stateValue === '' ? 'Enter the state' : null}
        />
        <TextInputComponent
          placeholderText="Pincode *"
          textValue={pinCode}
          keyboardTypeProp="phone-pad"
          maxLengthProp={6}
          onChange={text => {
            setPinCode(text);
          }}
          returnKeyTypeProp="next"
          errorMessage={isError && pinCode === '' ? 'Enter the pincode' : null}
        />
        <TextInputComponent
          placeholderText="Phone number *"
          textValue={phoneNumber}
          keyboardTypeProp="number-pad"
          maxLengthProp={10}
          onChange={text => {
            setPhoneNumber(text);
          }}
          returnKeyTypeProp="next"
          errorMessage={
            isError && (phoneNumber === '' || phoneNumber.length < 10)
              ? 'Enter the phone number'
              : null
          }
        />
        <TextInputComponent
          isEditable={!existingCustomer}
          placeholderText="GST IN *"
          textValue={gstIn}
          maxLengthProp={15}
          onChange={text => {
            setGstIn(text);
          }}
          returnKeyTypeProp="done"
          errorMessage={isError && gstIn === '' ? 'Enter the GST number' : null}
          autoCapitalizeProp={'characters'}
        />
      </ScrollView>
      {!isKeyboardVisible && (
        <View style={CommonStyles.buttonContainerStyle}>
          <TouchableOpacity onPress={addCustomers}>
            <Text style={CommonStyles.addStyle}>
              {existingCustomer ? 'Update Customer' : 'Add Cusomer'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: Colors.white,
    paddingBottom: 50,
  },
  contentStyle: {flexWrap: 1, paddingBottom: 80},
});
