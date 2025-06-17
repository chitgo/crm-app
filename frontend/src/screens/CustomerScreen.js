import { API_URL } from '@env'
import React, { useState, useContext } from 'react';
import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormInput from '../components/FormInput';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';

const CustomerScreen = () => {
  const { handleUnauthorized } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const navigation = useNavigation();

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', phone: '', company: '' };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (phone && !/^\+?[\d\s-]{7,}$/.test(phone)) {
      newErrors.phone = 'Invalid phone format';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddCustomer = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in AsyncStorage');
      }

      const url = `${API_URL}/api/customers`;


      const response = await axios.post(
        url,
        { name, email, phone, company },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );

      Alert.alert('Success', 'Customer added successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Customers', { screen: 'CustomerList' }) },
      ]);
    } catch (error) {
      if (error.response?.status === 401) {
        await handleUnauthorized();
        Alert.alert('Session Expired', 'Please login again.');
      } else if (error.response) {
        Alert.alert('Error', error.response.data.error || 'Failed to add customer');
      } else if (error.request) {
        Alert.alert('Error', 'Network error. Check server connection or URL.');
      } else {
        Alert.alert('Error', error.message || 'Something went wrong');
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-6">
        <FormInput
          label="Name"
          placeholder="Enter customer name"
          value={name}
          onChangeText={setName}
          iconName="person-outline"
          animationDelay={100}
          error={errors.name}
        />

        <FormInput
          label="Email"
          placeholder="Enter customer email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          iconName="mail-outline"
          animationDelay={200}
          error={errors.email}
        />

        <FormInput
          label="Phone"
          placeholder="Enter customer phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          iconName="call-outline"
          animationDelay={300}
          error={errors.phone}
        />

        <FormInput
          label="Company"
          placeholder="Enter company name"
          value={company}
          onChangeText={setCompany}
          iconName="briefcase-outline"
          animationDelay={400}
          error={errors.company}
        />

        <Animated.View
          entering={FadeInUp.delay(500).duration(500).easing(Easing.out(Easing.exp))}
          className="mt-6">
          <Pressable
            className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-500 p-4 shadow-lg"
            onPress={handleAddCustomer}>
            <Ionicons name="person-add-outline" size={24} color="white" />
            <Text className="ml-2 text-lg font-semibold text-white">Add Customer</Text>
          </Pressable>
          <Pressable
            className="flex-row items-center justify-center rounded-xl bg-gray-200 p-4 shadow-lg"
            onPress={() => navigation.navigate('Customers', { screen: 'CustomerList' })}>
            <Ionicons name="arrow-back-outline" size={24} color="#6B7280" />
            <Text className="ml-2 text-lg font-semibold text-gray-800">Back</Text>
          </Pressable>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default CustomerScreen;
