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

export default AddProducts = ({route, navigation}) => {
  const existingProduct = route?.params?.product;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [sizeHWL, setSizeHWL] = useState('');
  const [sizeIn, setSizeIn] = useState('');
  const [weight, setWeight] = useState('');
  const [noc, setNoc] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setPrice(existingProduct.price.toString());
      setSizeHWL(existingProduct.sizeInMM);
      setSizeIn(existingProduct.sizeInInches);
      setWeight(existingProduct.weight);
      setNoc(existingProduct.noc);
    }
  }, [existingProduct]);

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
    setName('');
    setPrice('');
    setSizeHWL('');
    setSizeIn('');
    setWeight('');
    setNoc('');
    Alert.alert(
      '',
      existingProduct
        ? 'Product Updated Successfully'
        : 'Product Add Successfully',
      [
        {
          text: 'ok',
          onPress: () => {
            navigation.pop();
            if (route?.params?.refreshCallback) {
              route?.params?.refreshCallback();
            }
          },
        },
      ],
    );
  };

  const onAddError = error => {
    Alert.alert(
      '',
      existingProduct
        ? 'Failed to update product, please Try again'
        : 'Failed to create product, please Try again',
    );
  };

  const addProducts = () => {
    if ((name === '') | (price === '')) {
      setIsError(true);
    } else {
      const product = {
        name: name,
        price: price,
        sizeInMM: sizeHWL,
        sizeInInches: sizeIn,
        weight: weight,
        noc: noc,
      };
      if (existingProduct) {
        SQLite.updateItemInTable(
          product,
          existingProduct,
          false,
          onAddSuccess,
          onAddError,
        );
      } else {
        SQLite.insertProducts(product, onAddSuccess, onAddError);
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
          autoCapitalizeProp={'words'}
          errorMessage={isError && name === '' ? 'Enter the name' : null}
        />

        <TextInputComponent
          placeholderText="Price *"
          textValue={price}
          onChange={text => {
            setPrice(text);
          }}
          keyboardTypeProp="numeric"
          autoCapitalizeProp={'words'}
          errorMessage={isError && price === '' ? 'Enter the price' : null}
        />

        <TextInputComponent
          placeholderText="Size ( Height * Width * Length )"
          textValue={sizeHWL}
          onChange={text => {
            setSizeHWL(text);
          }}
          autoCapitalizeProp={'words'}
        />

        <TextInputComponent
          placeholderText="Size in inches"
          textValue={sizeIn}
          onChange={text => {
            setSizeIn(text);
          }}
          autoCapitalizeProp={'words'}
        />

        <TextInputComponent
          placeholderText="Weight (g)"
          textValue={weight}
          onChange={text => {
            setWeight(text);
          }}
          autoCapitalizeProp={'words'}
        />

        <TextInputComponent
          placeholderText="Nos/ No of cups"
          textValue={noc}
          onChange={text => {
            setNoc(text);
          }}
          autoCapitalizeProp={'words'}
        />
      </ScrollView>
      {!isKeyboardVisible && (
        <View style={CommonStyles.buttonContainerStyle}>
          <TouchableOpacity onPress={addProducts}>
            <Text style={CommonStyles.addStyle}>
              {existingProduct ? 'Update Product' : 'Add Product'}
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
  contentStyle: {flexWrap: 1},
});
