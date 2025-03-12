import React, {useEffect, useState} from 'react';
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

export default ProductList = props => {
  const [productsData, setProductsData] = useState([]);
  const isFocused = useIsFocused();

  const getProducts = () => {
    SQLite.queryAllProducts(allData => {
      setProductsData(allData);
    });
  };

  useEffect(() => {
    if (isFocused) {
      getProducts();
    }
  }, [isFocused]);

  useEffect(() => {
    getProducts();
  }, []);

  const onDeleteSuccess = () => {
    Alert.alert('Success', 'Product deleted Successfully', [
      {
        text: 'ok',
        onPress: () => {
          getProducts();
        },
      },
    ]);
  };

  const onDeleteError = () => {
    Alert.alert('Error', 'Product deletion unsuccessful');
  };
  const deleteProduct = item => {
    SQLite.deleteItemInTable(item, false, onDeleteSuccess, onDeleteError);
  };

  return (
    <View
      style={
        productsData && productsData.length === 0
          ? CommonStyles.emptyStyle
          : CommonStyles.containerStyle
      }>
      {productsData && productsData.length === 0 ? (
        <Text style={CommonStyles.emptyTextStyle}>
          No products, please add products
        </Text>
      ) : (
        <FlatList
          data={productsData}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate('AddProduct', {
                    product: item,
                  })
                }>
                <View style={styles.itemContainerStyle}>
                  <View>
                    <Text style={styles.nameStyle}>
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
                  <View>
                    <Text style={styles.priceStyle}> &#8377; {item.price}</Text>
                    <TouchableOpacity
                      style={{marginTop: 16}}
                      onPress={() => deleteProduct(item)}>
                      <Image
                        style={CommonStyles.imageStyle}
                        resizeMode="contain"
                        source={Images.delete}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
      <TouchableOpacity
        style={CommonStyles.addButtonStyle}
        onPress={() => {
          props.navigation.navigate('AddProduct');
        }}>
        <Image source={Images.plus} style={CommonStyles.plusStyle} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  itemContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  priceStyle: {
    color: Colors.greenColor,
    fontWeight: 'bold',
    fontSize: 22,
  },
  sizeStyle: {
    marginTop: 10,
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: 16,
  },
  productItemStyle: {
    marginTop: 15,
    fontSize: 16,
    color: Colors.black,
  },
});
