import { API_URL } from '@env';
import React, { useState, useContext } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormInput from '../components/FormInput';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const EditCustomerScreen = () => {
  const { handleUnauthorized } = useContext(AuthContext);
  const route = useRoute();
  const { customer } = route.params;
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [company, setCompany] = useState(customer.company || '');
  const navigation = useNavigation();

  const handleUpdateCustomer = async () => {
    if (!name) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in AsyncStorage');
      }

      const url = `${API_URL}/api/customers/${customer.id}`;

      const response = await axios.patch(
        url,
        { name, email, phone, company },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );

      Alert.alert('Success', 'Customer updated successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('CustomerList') },
      ]);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
        navigation.navigate('Login');
        Alert.alert('Session Expired', 'Please login again.');
      } else if (error.response) {
        Alert.alert('Error', error.response.data.error || 'Failed to update customer');
      } else if (error.request) {
        Alert.alert('Error', 'Network error. Check server connection or URL.');
      } else {
        Alert.alert('Error', error.message || 'Something went wrong');
      }
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <FormInput
        label="Name"
        placeholder="Enter customer name"
        value={name}
        onChangeText={setName}
      />

      <FormInput
        label="Email"
        placeholder="Enter customer email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <FormInput
        label="Phone"
        placeholder="Enter customer phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <FormInput
        label="Company"
        placeholder="Enter company name"
        value={company}
        onChangeText={setCompany}
      />

      <Pressable className="mt-4 rounded-lg bg-blue-500 p-3" onPress={handleUpdateCustomer}>
        <Text className="text-center text-lg font-semibold text-white">Update Customer</Text>
      </Pressable>

      <Pressable className="mt-4" onPress={() => navigation.navigate('CustomerList')}>
        <Text className="text-center text-blue-500">Back to Customers</Text>
      </Pressable>
    </View>
  );
};

export default EditCustomerScreen;
