import { API_URL } from '@env'
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Alert, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';

const CustomerListScreen = () => {
  const { handleUnauthorized } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchCustomers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in AsyncStorage');
      }

      const response = await axios.get(`${API_URL}/api/customers`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      setCustomers(response.data.customers);
      setFilteredCustomers(response.data.customers);
    } catch (error) {
      if (error.response?.status === 401) {
        await handleUnauthorized();
        Alert.alert('Session Expired', 'Please login again.');
      } else {
        Alert.alert('Error', 'Failed to load customers. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchCustomers();
    }, [])
  );

  useEffect(() => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const handleDelete = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this customer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_URL}/api/customers/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setCustomers(customers.filter((customer) => customer.id !== id));
            setFilteredCustomers(filteredCustomers.filter((customer) => customer.id !== id));
            Alert.alert('Success', 'Customer deleted successfully');
          } catch (error) {
            if (error.response?.status === 401) {
              await handleUnauthorized();
              Alert.alert('Session Expired', 'Please login again.');
            } else {
              Alert.alert('Error', error.response?.data?.error || 'Failed to delete customer');
            }
          }
        },
      },
    ]);
  };

  const renderCustomer = ({ item, index }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 100)
        .duration(500)
        .easing(Easing.out(Easing.exp))}
      className="m-0 mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-md"
      style={{ elevation: 2 }}>
      <Pressable
        activeOpacity={0.8}
        className="active:scale-105"
        onPress={() => navigation.navigate('CustomerDetails', { customer: item })}>
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
            {item.email && (
              <View className="mt-1 flex-row items-center">
                <Ionicons name="mail-outline" size={12} color="#6B7280" />
                <Text
                  className="ml-1.5 text-sm font-medium text-gray-600"
                  style={{ lineHeight: 18 }}>
                  {item.email}
                </Text>
              </View>
            )}
            {item.phone && (
              <View className="mt-1 flex-row items-center">
                <Ionicons name="call-outline" size={12} color="#6B7280" />
                <Text
                  className="ml-1.5 text-sm font-medium text-gray-600"
                  style={{ lineHeight: 18 }}>
                  {item.phone}
                </Text>
              </View>
            )}
            {item.company && (
              <View className="mt-1 flex-row items-center">
                <Ionicons name="business-outline" size={12} color="#6B7280" />
                <Text
                  className="ml-1.5 text-sm font-semibold text-blue-600"
                  style={{ lineHeight: 18 }}>
                  {item.company}
                </Text>
              </View>
            )}
            <View className="my-2 border-t border-gray-200" />
            <Text className="text-xs text-gray-400">
              Created: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View className="flex-row items-start">
            <TouchableOpacity
              className="mr-2 rounded-full bg-blue-100 p-1 active:bg-blue-200"
              onPress={() => navigation.navigate('EditCustomer', { customer: item })}>
              <Ionicons name="pencil-outline" size={14} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-full bg-red-100 p-1 active:bg-red-200"
              onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash-outline" size={14} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-5">
      <View className="mb-5 flex-row items-center rounded-xl border border-gray-200 bg-white p-3 shadow-md">
        <Ionicons name="search-outline" size={20} color="#6B7280" />
        <TextInput
          className="ml-2 flex-1 text-base text-gray-700"
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl text-gray-600">Loading...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredCustomers}
            renderItem={renderCustomer}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <View className="items-center justify-center py-10">
                <Ionicons name="sad-outline" size={40} color="#6B7280" />
                <Text className="mt-2 text-lg text-gray-600">No customers found yet.</Text>
                <Text className="mt-1 text-sm text-gray-500">Start by adding a new customer!</Text>
                <TouchableOpacity
                  className="mt-4 rounded-xl bg-blue-500 p-3"
                  onPress={() => navigation.navigate('Customer')}>
                  <Text className="text-base font-semibold text-white">
                    Add your first customer
                  </Text>
                </TouchableOpacity>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            keyboardShouldPersistTaps="handled"
          />
          <Animated.View
            entering={FadeInUp.delay(200).duration(500).easing(Easing.out(Easing.exp))}
            className="absolute bottom-6 right-6">
            <Pressable
              className="rounded-full bg-blue-500 p-3.5 shadow-lg active:scale-105"
              onPress={() => navigation.navigate('Customer')}>
              <Ionicons name="person-add-outline" size={24} color="white" />
            </Pressable>
          </Animated.View>
        </>
      )}
    </View>
  );
};

export default CustomerListScreen;
