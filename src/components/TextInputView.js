import React from 'react';
import {View, StyleSheet, TextInput, Text} from 'react-native';
import Colors from '../assets/Colors';

export default TextInputComponent = props => {
  const {
    placeholderText,
    inputTextStyle,
    textValue,
    onChange,
    keyboardTypeProp,
    errorMessage,
    maxLengthProp,
    autoCapitalizeProp,
    isEditable
  } = props;
  return (
    <View style={styles.containerStyle}>
      <TextInput
      editable={isEditable}
        placeholder={placeholderText}
        placeholderTextColor="#8e8e8e"
        keyboardType={keyboardTypeProp}
        maxLength={maxLengthProp}
        style={[styles.inputStyle, inputTextStyle]}
        value={textValue}
        onChangeText={text => {
          onChange(text);
        }}
        autoCapitalize={autoCapitalizeProp}
      />
      {errorMessage && errorMessage !== '' && (
        <Text style={styles.errorStyle}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {},
  inputStyle: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
    borderRadius: 10,
    marginTop: 20,
    borderColor: Colors.black,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  errorStyle: {
    fontSize: 12,
    color: 'red',
    paddingTop: 4,
    paddingHorizontal: 10,
  },
});
