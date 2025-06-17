import React from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';

const STATUS_CONFIG = {
  NEW: { color: '#F59E0B', bgColor: '#FEF3C7', label: 'New' },
  CONTACTED: { color: '#3B82F6', bgColor: '#DBEAFE', label: 'Contacted' },
  QUALIFIED: { color: '#10B981', bgColor: '#D1FAE5', label: 'Qualified' },
  LOST: { color: '#EF4444', bgColor: '#FEE2E2', label: 'Lost' },
};

const LeadDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { lead } = route.params || {};

  if (!lead) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">No lead data available.</Text>
      </View>
    );
  }

  const getStatusStyle = (status) => {
    const config = STATUS_CONFIG[status?.toUpperCase()] || {
      color: '#6B7280',
      bgColor: '#E5E7EB',
      label: status || 'Unknown',
    };
    return config;
  };

  const formatDate = (date) => {
    if (!date) return 'No date';
    return new Date(date).toISOString().split('T')[0];
  };

  const { color, bgColor, label } = getStatusStyle(lead.status);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        <Animated.View
          entering={FadeInUp.delay(100).duration(500).easing(Easing.out(Easing.exp))}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md"
          style={{ elevation: 2 }}>
          <View className="mb-2">
            <Text className="text-sm font-semibold text-gray-700">Name</Text>
            <View className="mt-1 flex-row items-center">
              <Ionicons name="person-outline" size={16} color="#6B7280" />
              <Text className="ml-2 text-base font-bold text-gray-800">{lead.name}</Text>
            </View>
          </View>

          <View className="mb-2">
            <Text className="text-sm font-semibold text-gray-700">Customer</Text>
            <View className="mt-1 flex-row items-center">
              <Ionicons name="person-circle-outline" size={16} color="#6B7280" />
              <Text className="ml-2 text-base font-semibold text-blue-600">
                {lead.customer?.name || 'No Customer'}
              </Text>
            </View>
          </View>

          {lead.email && (
            <View className="mb-2">
              <Text className="text-sm font-semibold text-gray-700">Email</Text>
              <View className="mt-1 flex-row items-center">
                <Ionicons name="mail-outline" size={16} color="#6B7280" />
                <Text className="ml-2 text-base font-medium text-gray-800">{lead.email}</Text>
              </View>
            </View>
          )}

          {lead.phone && (
            <View className="mb-2">
              <Text className="text-sm font-semibold text-gray-700">Phone</Text>
              <View className="mt-1 flex-row items-center">
                <Ionicons name="call-outline" size={16} color="#6B7280" />
                <Text className="ml-2 text-base font-medium text-gray-800">{lead.phone}</Text>
              </View>
            </View>
          )}

          <View className="mb-2">
            <Text className="text-sm font-semibold text-gray-700">Status</Text>
            <View className="mt-1 flex-row items-center">
              <Ionicons name="pulse-outline" size={16} color="#6B7280" />
              <View
                className="ml-2 rounded-full px-1.5 py-0.5"
                style={{ backgroundColor: bgColor }}>
                <Text className="text-xs font-semibold" style={{ color }}>
                  {label}
                </Text>
              </View>
            </View>
          </View>

          {lead.followUpDate && (
            <View className="mb-2">
              <Text className="text-sm font-semibold text-gray-700">Follow-Up Date</Text>
              <View className="mt-1 flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text className="ml-2 text-base font-medium text-gray-800">
                  {formatDate(lead.followUpDate)}
                </Text>
              </View>
            </View>
          )}

          {lead.notes && (
            <View className="mb-2">
              <Text className="text-sm font-semibold text-gray-700">Notes</Text>
              <View className="mt-1 flex-row">
                <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                <Text
                  className="ml-2 flex-1 text-base font-medium text-gray-800"
                  style={{ lineHeight: 20 }}>
                  {lead.notes}
                </Text>
              </View>
            </View>
          )}

          <View className="my-2 border-t border-gray-200" />

          <View>
            <Text className="text-sm font-semibold text-gray-700">Created</Text>
            <View className="mt-1 flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text className="ml-2 text-xs text-gray-400">
                {new Date(lead.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).duration(500).easing(Easing.out(Easing.exp))}
          className="mt-6">
          <TouchableOpacity
            className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-500 p-4 shadow-lg active:bg-blue-600"
            onPress={() => navigation.navigate('EditLead', { lead })}>
            <Ionicons name="pencil-outline" size={20} color="white" />
            <Text className="ml-2 text-base font-semibold text-white">Edit Lead</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-xl bg-gray-200 p-4 shadow-lg active:bg-gray-300"
            onPress={() => navigation.navigate('Leads', { screen: 'LeadList' })}>
            <Ionicons name="arrow-back-outline" size={20} color="#6B7280" />
            <Text className="ml-2 text-base font-semibold text-gray-800">Back</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default React.memo(LeadDetailsScreen);
