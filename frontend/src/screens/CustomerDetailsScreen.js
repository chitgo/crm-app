import { API_URL } from '@env';
import { useState, useContext, useEffect, memo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUS_CONFIG = {
  NEW: { color: '#F59E0B', bgColor: '#FEF3C7', label: 'New' },
  CONTACTED: { color: '#3B82F6', bgColor: '#DBEAFE', label: 'Contacted' },
  QUALIFIED: { color: '#10B981', bgColor: '#D1FAE5', label: 'Qualified' },
  LOST: { color: '#EF4444', bgColor: '#FEE2E2', label: 'Lost' },
};

const CustomerDetailsScreen = () => {
  const { handleUnauthorized } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { customer } = route.params || {};
  const [leads, setLeads] = useState(customer?.leads || []);
  const [filteredLeads, setFilteredLeads] = useState(customer?.leads || []);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (customer && leads.length > 0) {
      const filtered = leads.filter((lead) =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLeads(filtered);
    }
  }, [searchQuery, leads, customer]);

  if (!customer) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">No customer data available.</Text>
      </View>
    );
  }

  const getStatusStyle = (status) => {
    return (
      STATUS_CONFIG[status?.toUpperCase()] || {
        color: '#6B7280',
        bgColor: '#E5E7EB',
        label: status || 'Unknown',
      }
    );
  };

  const formatDate = (date) => {
    if (!date) return 'No date';
    return new Date(date).toISOString().split('T')[0];
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this lead?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_URL}/api/leads/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setLeads(leads.filter((lead) => lead.id !== id));
            setFilteredLeads(filteredLeads.filter((lead) => lead.id !== id));
            Alert.alert('Success', 'Lead deleted successfully');
          } catch (error) {
            if (error.response?.status === 401) {
              await handleUnauthorized();
              Alert.alert('Session Expired', 'Please login again.');
            } else {
              Alert.alert('Error', error.response?.data?.error || 'Failed to delete lead');
            }
          }
        },
      },
    ]);
  };

  const renderLead = ({ item, index }) => {
    const { color, bgColor, label } = getStatusStyle(item.status);

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100)
          .duration(500)
          .easing(Easing.out(Easing.exp))}
        className="m-0 mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-md"
        style={{ elevation: 2 }}>
        <Pressable
          activeOpacity={0.8}
          className="active:scale-105"
          onPress={() =>
            navigation.navigate('Leads', { screen: 'LeadDetailsScreen', params: { lead: item } })
          }>
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
              <View className="mt-1 flex-row items-center">
                <Ionicons name="pulse-outline" size={12} color="#6B7280" />
                <View
                  className="ml-1.5 rounded-full px-1.5 py-0.5"
                  style={{ backgroundColor: bgColor }}>
                  <Text className="text-xs font-semibold" style={{ color }}>
                    {label}
                  </Text>
                </View>
              </View>
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
              {item.followUpDate && (
                <View className="mt-1 flex-row items-center">
                  <Ionicons name="calendar-outline" size={12} color="#6B7280" />
                  <Text
                    className="ml-1.5 text-sm font-medium text-gray-600"
                    style={{ lineHeight: 18 }}>
                    {formatDate(item.followUpDate)}
                  </Text>
                </View>
              )}
              {item.notes && (
                <View className="mt-1 flex-row items-center">
                  <Ionicons name="document-text-outline" size={12} color="#6B7280" />
                  <Text
                    className="ml-1.5 text-sm font-medium text-gray-600"
                    style={{ lineHeight: 18 }}
                    numberOfLines={2}>
                    {item.notes}
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
                onPress={() =>
                  navigation.navigate('Leads', { screen: 'EditLead', params: { lead: item } })
                }>
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
  };

  return (
    <View className="flex-1 bg-gray-50 p-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View
          entering={FadeInUp.duration(500).easing(Easing.out(Easing.exp))}
          className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-md"
          style={{ elevation: 2 }}>
          <Text className="text-xl font-bold text-gray-800">{customer.name}</Text>
          {customer.email && (
            <View className="mt-2 flex-row items-center">
              <Ionicons name="mail-outline" size={16} color="#6B7280" />
              <Text className="ml-1.5 text-sm font-medium text-gray-600">{customer.email}</Text>
            </View>
          )}
          {customer.phone && (
            <View className="mt-1 flex-row items-center">
              <Ionicons name="call-outline" size={16} color="#6B7280" />
              <Text className="ml-1.5 text-sm font-medium text-gray-600">{customer.phone}</Text>
            </View>
          )}
          {customer.company && (
            <View className="mt-1 flex-row items-center">
              <Ionicons name="business-outline" size={16} color="#6B7280" />
              <Text className="ml-1.5 text-sm font-semibold text-blue-600">{customer.company}</Text>
            </View>
          )}
          <View className="my-2 border-t border-gray-200" />
          <Text className="text-xs text-gray-400">
            Created: {new Date(customer.createdAt).toLocaleDateString()}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(100).duration(500).easing(Easing.out(Easing.exp))}
          className="mb-5 flex-row items-center rounded-xl border border-gray-200 bg-white p-3 shadow-md">
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            className="ml-2 flex-1 text-base text-gray-700"
            placeholder="Search leads by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500).easing(Easing.out(Easing.exp))}>
          <Text className="mb-3 text-lg font-semibold text-gray-800">Leads</Text>
          {filteredLeads.length === 0 ? (
            <View className="items-center justify-center py-10">
              <Ionicons name="sad-outline" size={40} color="#6B7280" />
              <Text className="mt-2 text-lg text-gray-600">No leads found.</Text>
              <Text className="mt-1 text-sm text-gray-500">Start by adding a new lead!</Text>
            </View>
          ) : (
            <FlatList
              data={filteredLeads}
              renderItem={renderLead}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 80 }}
            />
          )}
        </Animated.View>
      </ScrollView>

      <Animated.View
        entering={FadeInUp.delay(300).duration(500).easing(Easing.out(Easing.exp))}
        className="absolute bottom-6 right-6">
        <Pressable
          className="rounded-full bg-blue-500 p-3.5 shadow-lg active:scale-105"
          onPress={() =>
            navigation.navigate('Leads', { screen: 'Lead', params: { customerId: customer.id } })
          }>
          <Ionicons name="briefcase-outline" size={24} color="white" />
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default memo(CustomerDetailsScreen);
