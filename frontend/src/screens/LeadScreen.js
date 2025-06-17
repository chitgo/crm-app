import { API_URL } from '@env';
import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, Pressable, Alert, TouchableOpacity, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';
import FormInput from '../components/FormInput';
import DateTimePicker from '@react-native-community/datetimepicker';

const LeadScreen = () => {
  const { handleUnauthorized } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('NEW');
  const [customerId, setCustomerId] = useState(null);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const navigation = useNavigation();
  const route = useRoute();
  const { customerId: initialCustomerId } = route.params || {};

  useEffect(() => {
    if (initialCustomerId) {
      setCustomerId(initialCustomerId.toString());
    }
    const fetchCustomers = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(response.data.customers);
      } catch (error) {
        Alert.alert('Error', 'Failed to load customers.');
      }
    };
    fetchCustomers();
  }, [initialCustomerId]);

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', phone: '' };

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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFollowUpDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/leads`,
        {
          name,
          email,
          phone,
          status,
          customerId: customerId ? parseInt(customerId) : null,
          followUpDate: followUpDate ? formatDate(followUpDate) : null,
          notes: notes || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Lead added successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Leads', { screen: 'LeadList' }) },
      ]);
    } catch (error) {
      if (error.response?.status === 401) {
        await handleUnauthorized();
        Alert.alert('Session Expired', 'Please login again.');
      } else {
        Alert.alert('Error', error.response?.data?.error || 'Failed to add lead');
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-6">
        <FormInput
          label="Name"
          placeholder="Enter name"
          value={name}
          onChangeText={setName}
          iconName="person-outline"
          animationDelay={100}
          error={errors.name}
        />

        <FormInput
          label="Email"
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          iconName="mail-outline"
          animationDelay={200}
          error={errors.email}
        />

        <FormInput
          label="Phone"
          placeholder="Enter phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          iconName="call-outline"
          animationDelay={300}
          error={errors.phone}
        />

        <Animated.View
          entering={FadeInUp.delay(400).duration(500).easing(Easing.out(Easing.exp))}
          className="mb-6">
          <Text className="mb-2 text-lg font-semibold text-gray-800">Follow-Up Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <Ionicons name="calendar-outline" size={24} color="#6B7280" className="mr-3" />
            <Text className="flex-1 text-lg text-gray-800">
              {followUpDate ? formatDate(followUpDate) : 'Select date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={followUpDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </Animated.View>

        <FormInput
          label="Notes"
          placeholder="Enter notes"
          value={notes}
          onChangeText={setNotes}
          iconName="document-text-outline"
          animationDelay={500}
          multiline
          numberOfLines={4}
        />

        <Animated.View
          entering={FadeInUp.delay(600).duration(500).easing(Easing.out(Easing.exp))}
          className="mb-6">
          <Text className="mb-2 text-lg font-semibold text-gray-800">Status</Text>
          <View
            style={{ height: 58 }}
            className="flex-row items-center rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <Ionicons name="pulse-outline" size={24} color="#6B7280" className="mr-3" />
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={{ flex: 1 }}>
              <Picker.Item label="New" value="NEW" />
              <Picker.Item label="Contacted" value="CONTACTED" />
              <Picker.Item label="Qualified" value="QUALIFIED" />
              <Picker.Item label="Lost" value="LOST" />
            </Picker>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(700).duration(500).easing(Easing.out(Easing.exp))}
          className="mb-6">
          <Text className="mb-2 text-lg font-semibold text-gray-800">Customer</Text>
          <View
            style={{ height: 58 }}
            className="flex-row items-center rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <Ionicons name="person-outline" size={24} color="#6B7280" className="mr-3" />
            <Picker
              selectedValue={customerId}
              onValueChange={(itemValue) => setCustomerId(itemValue)}
              style={{ flex: 1 }}>
              <Picker.Item label="No Customer" value={null} />
              {customers.map((customer) => (
                <Picker.Item
                  key={customer.id}
                  label={customer.name}
                  value={customer.id.toString()}
                />
              ))}
            </Picker>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(800).duration(500).easing(Easing.out(Easing.exp))}
          className="mt-6">
          <Pressable
            className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-500 p-4 shadow-lg"
            onPress={handleSubmit}>
            <Ionicons name="checkmark-circle-outline" size={24} color="white" />
            <Text className="ml-2 text-lg font-semibold text-white">Add Lead</Text>
          </Pressable>
          <Pressable
            className="flex-row items-center justify-center rounded-xl bg-gray-200 p-4 shadow-lg"
            onPress={() => navigation.navigate('Leads', { screen: 'LeadList' })}>
            <Ionicons name="arrow-back-outline" size={24} color="#6B7280" />
            <Text className="ml-2 text-lg font-semibold text-gray-800">Back</Text>
          </Pressable>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default LeadScreen;
