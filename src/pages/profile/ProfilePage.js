import {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Colors from '../../assets/Colors';
import {
  getCompanyDetails,
  storeCompanyDetails,
} from '../../assets/utils/AsyncStorageUtil';
import {CommonStyles} from '../../assets/utils/CommonStyles';
import {objectValuesEmpty} from '../../assets/utils/CommonUtils';
import Images from '../../assets/utils/Images';
import {useIsFocused} from '@react-navigation/native';

export default ProfilePage = () => {
  const [company, setCompany] = useState({});
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isError, setIsError] = useState(false);
  const isFocused = useIsFocused();

  const getDetails = async () => {
    const value = await getCompanyDetails();
    if (value) {
      setCompany(value);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setIsEdit(false);
    }
  }, [isFocused]);

  useEffect(() => {
    getDetails();
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

  const saveDetails = () => {
    if (company && !objectValuesEmpty(company)) {
      setIsError(true);
    } else {
      setIsEdit(false);
      storeCompanyDetails(company);
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
        <View>
          <Text style={styles.headingStyle}>Name:</Text>
          {isEdit ? (
            <TextInputComponent
              placeholderText="Name *"
              textValue={company?.name}
              onChange={text => {
                setCompany({...company, name: text});
              }}
              autoCapitalizeProp={'words'}
              errorMessage={
                isError && company?.name === '' ? 'Enter the name' : null
              }
            />
          ) : (
            <Text style={styles.valueStyle}>{company?.name}</Text>
          )}

          <Text style={styles.headingStyle}>Address:</Text>
          {isEdit ? (
            <>
              <TextInputComponent
                placeholderText="Addressline one *"
                textValue={company?.addressOne}
                onChange={text => {
                  setCompany({...company, addressOne: text});
                }}
                autoCapitalizeProp={'words'}
                errorMessage={
                  isError && company?.addressOne === ''
                    ? 'Enter the address one'
                    : null
                }
              />
              <TextInputComponent
                placeholderText="Addressline Two *"
                textValue={company?.addressTwo}
                onChange={text => {
                  setCompany({...company, addressTwo: text});
                }}
                autoCapitalizeProp={'words'}
                errorMessage={
                  isError && company?.addressTwo === ''
                    ? 'Enter the address two'
                    : null
                }
              />
              <TextInputComponent
                placeholderText="City *"
                textValue={company?.city}
                onChange={text => {
                  setCompany({...company, city: text});
                }}
                autoCapitalizeProp={'words'}
                errorMessage={
                  isError && company?.city === '' ? 'Enter the city' : null
                }
              />
              <TextInputComponent
                placeholderText="State *"
                textValue={company?.state}
                onChange={text => {
                  setCompany({...company, state: text});
                }}
                autoCapitalizeProp={'words'}
                errorMessage={
                  isError && company?.state === '' ? 'Enter the state' : null
                }
              />
              <TextInputComponent
                placeholderText="Pincode *"
                textValue={company?.pincode}
                keyboardTypeProp="phone-pad"
                maxLengthProp={6}
                onChange={text => {
                  setCompany({...company, pincode: text});
                }}
                errorMessage={
                  isError && company?.pincode === ''
                    ? 'Enter the pincode'
                    : null
                }
              />
            </>
          ) : (
            <Text style={styles.valueStyle}>
              {company?.addressOne +
                '\n' +
                company?.addressTwo +
                '\n' +
                company?.city +
                '-' +
                company?.pincode +
                '.\n' +
                company?.state}
            </Text>
          )}

          <Text style={styles.headingStyle}>HSN Code:</Text>
          {isEdit ? (
            <TextInputComponent
              placeholderText="HSN Code *"
              textValue={company?.hsnCode}
              keyboardTypeProp="number-pad"
              maxLengthProp={4}
              onChange={text => {
                setCompany({...company, hsnCode: text});
              }}
              autoCapitalizeProp={'words'}
              errorMessage={
                isError && company?.hsnCode === '' ? 'Enter the HSN Code' : null
              }
            />
          ) : (
            <Text style={styles.valueStyle}>{company?.hsnCode}</Text>
          )}

          <Text style={styles.headingStyle}>Contacts:</Text>
          {isEdit ? (
            <>
              <TextInputComponent
                placeholderText="Phone number *"
                textValue={company?.phoneOne}
                maxLengthProp={10}
                onChange={text => {
                  setCompany({...company, phoneOne: text});
                }}
                keyboardTypeProp="number-pad"
                errorMessage={
                  isError && company?.phoneOne === ''
                    ? 'Enter the Phone number'
                    : null
                }
              />
              <TextInputComponent
                placeholderText="Phone number *"
                textValue={company?.phoneTwo}
                maxLengthProp={10}
                onChange={text => {
                  setCompany({...company, phoneTwo: text});
                }}
                keyboardTypeProp="number-pad"
                errorMessage={
                  isError && company?.phoneTwo === ''
                    ? 'Enter the Phone number'
                    : null
                }
              />
              <TextInputComponent
                placeholderText="Email *"
                textValue={company?.email}
                onChange={text => {
                  setCompany({...company, email: text});
                }}
                keyboardTypeProp="email-address"
                errorMessage={
                  isError && company?.email === '' ? 'Enter the Email' : null
                }
              />
            </>
          ) : (
            <>
              <View style={CommonStyles.containerRowStyle}>
                <Image
                  style={CommonStyles.imageStyle}
                  resizeMode="contain"
                  source={Images.phone}
                />
                <Text style={styles.valueStyle}>
                  {company?.phoneOne + ', ' + company?.phoneTwo}
                </Text>
              </View>
              <View style={CommonStyles.containerRowStyle}>
                <Image
                  style={CommonStyles.imageStyle}
                  resizeMode="contain"
                  source={Images.email}
                />
                <Text style={styles.valueStyle}>{company?.email}</Text>
              </View>
            </>
          )}

          <Text style={styles.headingStyle}>GST Number:</Text>
          {isEdit ? (
            <TextInputComponent
              placeholderText="GST number *"
              textValue={company?.gstIn}
              maxLengthProp={15}
              onChange={text => {
                setCompany({...company, gstIn: text});
              }}
              autoCapitalizeProp={'characters'}
              errorMessage={
                isError && company?.gstIn === '' ? 'Enter the GST number' : null
              }
            />
          ) : (
            <View style={CommonStyles.containerRowStyle}>
              <Image
                style={CommonStyles.imageStyle}
                resizeMode="contain"
                source={Images.gst}
              />
              <Text style={styles.valueStyle}>{company?.gstIn}</Text>
            </View>
          )}

          <Text style={styles.headingStyle}>Bank Account Details:</Text>
          {isEdit ? (
            <>
              <TextInputComponent
                placeholderText="Bank Name *"
                textValue={company?.bankName}
                onChange={text => {
                  setCompany({...company, bankName: text});
                }}
                autoCapitalizeProp={'words'}
                errorMessage={
                  isError && company?.bankName === ''
                    ? 'Enter the bank name'
                    : null
                }
              />
              <TextInputComponent
                placeholderText="Account number *"
                textValue={company?.accountNumber}
                onChange={text => {
                  setCompany({...company, accountNumber: text});
                }}
                autoCapitalizeProp={'words'}
                errorMessage={
                  isError && company?.accountNumber === ''
                    ? 'Enter the Account number'
                    : null
                }
              />
              <TextInputComponent
                placeholderText="Bank IFSC *"
                textValue={company?.ifscode}
                onChange={text => {
                  setCompany({...company, ifscode: text});
                }}
                autoCapitalizeProp={'characters'}
                errorMessage={
                  isError && company?.ifscode === '' ? 'Enter the IFSC' : null
                }
              />
            </>
          ) : (
            <Text style={styles.valueStyle}>
              {company?.bankName +
                '\n' +
                company?.accountNumber +
                '\n' +
                company?.ifscode}
            </Text>
          )}
        </View>
      </ScrollView>
      {!isKeyboardVisible && isEdit && (
        <View style={CommonStyles.buttonContainerStyle}>
          <TouchableOpacity onPress={saveDetails}>
            <Text style={CommonStyles.addStyle}>Save Details</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isEdit && (
        <TouchableOpacity
          style={CommonStyles.addButtonStyle}
          onPress={() => {
            setIsEdit(true);
          }}>
          <Image source={Images.editWhite} style={CommonStyles.plusStyle} />
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  contentStyle: {flexWrap: 1, paddingBottom: 90},
  headingStyle: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 8,
    color: Colors.black,
    fontWeight: 'bold',
  },
  valueStyle: {
    fontSize: 18,
    color: Colors.black,
  },
});
