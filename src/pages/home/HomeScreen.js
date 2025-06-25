import React from 'react';
import {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Colors from '../../assets/Colors';
import {companyDetailsData} from '../../assets/data/AppData';
import {
  getCompanyDetails,
  storeCompanyDetails,
} from '../../assets/utils/AsyncStorageUtil';
import {
  calculatePrices,
  displayAmountFormat,
} from '../../assets/utils/CommonUtils';
import {constructHTML} from '../../assets/utils/HtmlUtils';
import SQLite from '../../assets/utils/SQLite';
import {useIsFocused} from '@react-navigation/native';

export default HomeScreen = () => {
  const [customer, setCustomer] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [customersData, setCustomersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [companyData, setCompanyData] = useState(null);

  const isFocused = useIsFocused();

  const setDetails = async () => {
    const value = await getCompanyDetails();
    if (!value) {
      storeCompanyDetails(companyDetailsData);
    } else {
      setCompanyData(value);
    }
  };

  const getData = () => {
    SQLite.queryAllCustomers(allData => {
      setCustomersData(allData);
    });

    SQLite.queryAllProducts(allData => {
      setProductsData(allData);
    });
  };

  useEffect(() => {
    if (isFocused) {
      setCustomer(null);
      setSelectedProducts([]);
      getData();
      setDetails();
    }
  }, [isFocused]);

  useEffect(() => {
    setDetails();
    getData();

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

  const quantityChange = (item, isInCrement) => {
    const copySetSelectedProducts = selectedProducts.map(product => {
      if (product.id === item.id) {
        if (isInCrement) {
          product.quantity = item.quantity + 1;
        } else {
          product.quantity = item.quantity - 1;
        }
      }
      return product;
    });
    setSelectedProducts(copySetSelectedProducts);
  };

  const quantityTextChange = (item, text) => {
    const copySetSelectedProducts = selectedProducts.map(product => {
      if (product.id === item.id) {
        product.quantity = text && text.length > 0 ? parseInt(text) : '';
      }
      return product;
    });
    setSelectedProducts(copySetSelectedProducts);
  };

  const priceChange = (item, text) => {
    const copySelectedProducts = selectedProducts.map(product => {
      if (product.id === item.id) {
        product.price = text.split(' ')[1];
      }
      return product;
    });
    setSelectedProducts(copySelectedProducts);
  };

  const totalPriceView = () => {
    const toalObj = calculatePrices(selectedProducts);
    return (
      selectedProducts &&
      selectedProducts.length > 0 && (
        <View style={styles.priceContainerStyle}>
          <View>
            <Text style={styles.priceStyle}>Subtotal: </Text>
            <Text style={styles.priceStyle}>SGST: </Text>
            <Text style={styles.priceStyle}>CGST: </Text>
            <Text style={styles.priceStyle}>Grand Total: </Text>
          </View>
          <View>
            <Text style={styles.priceStyle}>
              {`${'\u20B9'} ${displayAmountFormat(toalObj.subTotal)}`}
            </Text>
            <Text style={styles.priceStyle}>
              {`${'\u20B9'} ${displayAmountFormat(toalObj.sgst)}`}
            </Text>
            <Text style={styles.priceStyle}>
              {`${'\u20B9'} ${displayAmountFormat(toalObj.cgst)}`}
            </Text>
            <Text style={styles.priceStyle}>
              {`${'\u20B9'} ${displayAmountFormat(toalObj.grandTotal)}`}
            </Text>
          </View>
        </View>
      )
    );
  };

  const createPDF = async () => {
    if (customer && selectedProducts && selectedProducts.length > 0) {
      const htmlContent = constructHTML(
        companyData,
        customer,
        selectedProducts,
      );
      try {
        let PDFOptions = {
          html: htmlContent,
          fileName: customer.name.split(' ')[0] + ' quotation',
          directory: Platform.OS === 'android' ? 'Downloads' : 'Documents',
        };
        let file = await RNHTMLtoPDF.convert(PDFOptions);
        if (!file.filePath) {
          return;
        } else {
          Alert.alert('Success', 'Quotation created Successfully', [
            {
              text: 'ok',
              onPress: () => {
                setCustomer(null);
                setSelectedProducts([]);
              },
            },
          ]);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to create quotation, please Try again');
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
        <Dropdown
          placeholder="Select Customer"
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          style={[styles.dropdown]}
          search
          searchPlaceholder="Search..."
          data={customersData}
          labelField="name"
          valueField="name"
          value={customer}
          maxHeight={300}
          onChange={item => {
            setCustomer(item);
          }}
          renderItem={item => {
            return (
              <View style={styles.dropdownContentStyle}>
                <Text style={styles.customerNameStyle}>{item.name}</Text>
                <Text>
                  {item.addressOne +
                    ', ' +
                    item.addressTwo +
                    '\n' +
                    item.city +
                    '-' +
                    item.pincode}
                </Text>
                {(item.phone || item.phone !== '') && <Text>{item.phone}</Text>}
                {(item.gstNo || item.gstNo !== '') && <Text>{item.gstNo}</Text>}
              </View>
            );
          }}
        />

        <Dropdown
          disable={customer === null}
          placeholder="Select products"
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          style={[styles.dropdown]}
          search
          searchPlaceholder="Search..."
          data={productsData}
          labelField="name"
          valueField="name"
          value={customer}
          maxHeight={300}
          onChange={item => {
            const duplicate = selectedProducts.findIndex(
              duplicateItem => duplicateItem.id === item.id,
            );
            if (duplicate === -1) {
              const selectedItem = {...item, quantity: 1};
              setSelectedProducts([...selectedProducts, selectedItem]);
            }
          }}
          renderItem={item => {
            return (
              <View style={styles.productDropdownContentStyle}>
                <View>
                  <Text style={styles.customerNameStyle}>
                    {item.name}{' '}
                    {item.weight && item.weight !== ''
                      ? item.weight
                      : item.noc && item.noc !== '' && item.noc}
                  </Text>
                  {item.sizeInMM && item.sizeInMM !== '' && (
                    <Text>{item.sizeInMM}</Text>
                  )}
                  {item.sizeInInches && item.sizeInInches !== '' && (
                    <Text>{item.sizeInInches}</Text>
                  )}
                </View>
                <View>
                  <Text>{`${'\u20B9'} ${item.price}`}</Text>
                </View>
              </View>
            );
          }}
        />

        {selectedProducts && selectedProducts.length > 0 && (
          <>
            <Text style={styles.productsTextStyle}>
              Products ({selectedProducts.length})
            </Text>
            <FlatList
              scrollEnabled={false}
              data={selectedProducts}
              renderItem={({item}) => {
                return (
                  <View style={styles.itemContainerStyle}>
                    <View style={{flex: 1}}>
                      <Text style={styles.productNameItemStyle}>
                        {item.name}{' '}
                        {item.weight && item.weight !== ''
                          ? item.weight
                          : item.noc && item.noc !== '' && item.noc}
                      </Text>
                      {item.sizeInMM && item.sizeInMM !== '' && (
                        <Text style={styles.productItemStyle}>
                          {item.sizeInMM}
                        </Text>
                      )}
                      {item.sizeInInches && item.sizeInInches !== '' && (
                        <Text style={styles.productItemStyle}>
                          {item.sizeInInches}
                        </Text>
                      )}
                    </View>

                    <View style={{flex: 1}}>
                      <TextInput
                        keyboardType="numeric"
                        style={styles.priceTextStyle}
                        value={`${'\u20B9'} ${item.price}`}
                        onChangeText={text => priceChange(item, text)}
                      />
                      <View style={styles.quantityChangeContainerStyle}>
                        <TouchableOpacity
                          onPress={() => quantityChange(item, false)}>
                          <Text style={styles.counterIconStyle}>-</Text>
                        </TouchableOpacity>

                        <TextInput
                          maxLength={4}
                          keyboardType="numeric"
                          style={styles.quantityStyle}
                          value={item.quantity.toString()}
                          onChangeText={text => quantityTextChange(item, text)}
                        />
                        <TouchableOpacity
                          onPress={() => quantityChange(item, true)}>
                          <Text style={styles.counterIconStyle}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </>
        )}
        {totalPriceView()}
      </ScrollView>
      {!isKeyboardVisible && (
        <View style={styles.buttonContainerStyle}>
          <TouchableOpacity
            style={styles.restButtonStyle}
            onPress={() => {
              setCustomer(null), setSelectedProducts([]);
            }}>
            <Text style={styles.createTextStyle}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButtonStyle}
            onPress={createPDF}>
            <Text style={styles.createTextStyle}>Create Quotation</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  contentStyle: {flexWrap: 1, paddingBottom: 90},
  productsTextStyle: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainerStyle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    bottom: 10,
  },
  createButtonStyle: {
    width: '53%',
    alignItems: 'center',
    backgroundColor: Colors.greenColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  restButtonStyle: {
    width: '40%',
    alignItems: 'center',
    backgroundColor: '#0000FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  createTextStyle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Colors.black,
  },
  dropdownContentStyle: {
    padding: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.black,
  },
  productDropdownContentStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.black,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.black,
  },
  itemContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.black,
    padding: 10,
    marginHorizontal: 12,
    marginBottom: 10,
  },
  quantityChangeContainerStyle: {
    width: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
  productNameItemStyle: {
    fontSize: 18,
    color: Colors.black,
    fontWeight: 'bold',
    paddingTop: 4,
  },
  productItemStyle: {
    fontSize: 18,
    color: Colors.black,
    paddingTop: 4,
  },
  priceTextStyle: {
    color: 'green',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  quantityStyle: {
    color: Colors.black,
    textAlign: 'center',
    fontSize: 18,
    height: 40,
  },
  counterIconStyle: {
    textAlign: 'center',
    fontSize: 20,
    width: 20,
    height: 40,
    paddingLeft: 5,
    paddingTop: 3,
    fontWeight: '60',
  },
  priceContainerStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
    marginTop: 20,
    paddingLeft: 120,
  },
  priceStyle: {
    textAlign: 'right',
    fontSize: 16,
    color: 'green',
  },
  customerNameStyle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
