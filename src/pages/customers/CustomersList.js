import {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Colors from '../../assets/Colors';
import {CommonStyles} from '../../assets/utils/CommonStyles';
import Images from '../../assets/utils/Images';
import SQLite from '../../assets/utils/SQLite';
import {useIsFocused} from '@react-navigation/native';

export default CustomersList = props => {
  const [customers, setCustomers] = useState([]);
  const isFocused = useIsFocused();

  const getCustomers = () => {
    SQLite.queryAllCustomers(allData => {
      setCustomers(allData);
    });
  };

  useEffect(() => {
    getCustomers();
  }, []);

  useEffect(() => {
    if (isFocused) {
      getCustomers();
    }
  }, [isFocused]);

  const onDeleteSuccess = () => {
    Alert.alert('Success', 'Customer data deleted Successfully', [
      {
        text: 'ok',
        onPress: () => {
          getCustomers();
        },
      },
    ]);
  };

  const onDeleteError = () => {
    Alert.alert('Error', 'Customer deletion unsuccessful');
  };

  const deleteCustomer = item => {
    SQLite.deleteItemInTable(item, true, onDeleteSuccess, onDeleteError);
  };

  return (
    <View
      style={
        customers && customers.length === 0
          ? CommonStyles.emptyStyle
          : CommonStyles.containerStyle
      }>
      {customers && customers.length === 0 ? (
        <Text style={CommonStyles.emptyTextStyle}>
          No customers, please add customers
        </Text>
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate('AddCustomer', {
                    customer: item,
                  })
                }>
                <View style={styles.itemContainerStyle}>
                  <Text style={styles.nameStyle}>{item.name}</Text>
                  <View style={CommonStyles.containerRowStyle}>
                    <Image
                      style={CommonStyles.imageStyle}
                      resizeMode="contain"
                      source={Images.address}
                    />
                    <Text style={styles.addressStyle}>
                      {item.addressOne +
                        ', ' +
                        item.addressTwo +
                        ',\n' +
                        item.city +
                        '-' +
                        item.pincode}
                    </Text>
                  </View>
                  {(item.phone || item.phone !== '') && (
                    <View style={CommonStyles.containerRowStyle}>
                      <Image
                        style={CommonStyles.imageStyle}
                        resizeMode="contain"
                        source={Images.phone}
                      />
                      <Text style={styles.phoneStyle}>{item.phone}</Text>
                    </View>
                  )}
                  {(item.gstNo || item.gstNo !== '') && (
                    <View style={CommonStyles.containerRowStyle}>
                      <Image
                        style={CommonStyles.imageStyle}
                        resizeMode="contain"
                        source={Images.gst}
                      />
                      <Text style={styles.phoneStyle}>{item.gstNo}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={() => deleteCustomer(item)}
                    style={{position: 'absolute', right: 0, top: 20}}>
                    <Image
                      style={CommonStyles.imageStyle}
                      resizeMode="contain"
                      source={Images.delete}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
      <TouchableOpacity
        style={CommonStyles.addButtonStyle}
        onPress={() => {
          props.navigation.navigate('AddCustomer');
        }}>
        <Image source={Images.plus} style={CommonStyles.plusStyle} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainerStyle: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.black,
    padding: 10,
    margin: 10,
  },
  nameStyle: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: 20,
  },
  addressStyle: {
    width: '75%',
    lineHeight: 30,
    fontSize: 18,
    color: Colors.black,
  },
  phoneStyle: {
    fontSize: 18,
    color: Colors.black,
  },
});
