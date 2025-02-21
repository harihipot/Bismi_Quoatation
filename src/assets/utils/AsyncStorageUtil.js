import AsyncStorage from '@react-native-async-storage/async-storage';
const COMPANY_DETAILS = 'COMPANY_DETAILS';

const _store = async (key, data) => {
  const dataJson = JSON.stringify(data);
  try {
    return await AsyncStorage.setItem(key, dataJson);
  } catch (error) {
    return null;
  }
};

const _get = async key => {
  try {
    return AsyncStorage.getItem(key, (error, data) => {
      if (data !== null) {
        return data;
      }
    });
  } catch (error) {
    return null;
  }
};

const _reset = async key => {
  let data = await _get(key);
  try {
    if (data) {
      await AsyncStorage.setItem(key, '');
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const storeCompanyDetails = async data => {
  return _store(COMPANY_DETAILS, data);
};

export const getCompanyDetails = async data => {
  const details = await _get(COMPANY_DETAILS);

  if (details) {
    return JSON.parse(details);
  }
  return null;
};
