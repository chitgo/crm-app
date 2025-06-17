import { API_URL } from '@env';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInUp,
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const DashboardScreen = () => {
  const { user, handleUnauthorized } = useContext(AuthContext);
  const [stats, setStats] = useState({
    customers: 0,
    leads: 0,
    newLeads: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const scaleCustomers = useSharedValue(1);
  const scaleTotalLeads = useSharedValue(1);
  const scaleNewLeads = useSharedValue(1);

  const animatedCustomersStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleCustomers.value }],
  }));
  const animatedTotalLeadsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleTotalLeads.value }],
  }));
  const animatedNewLeadsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleNewLeads.value }],
  }));

  const handlePressIn = (scale) => {
    scale.value = withSpring(0.95);
  };
  const handlePressOut = (scale) => {
    scale.value = withSpring(1);
  };

  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      };

      const customersResponse = await axios.get(`${API_URL}/api/customers`, config);
      const customersCount = customersResponse.data.customers.length;

      const leadsResponse = await axios.get(`${API_URL}/api/leads`, config);
      const leadsCount = leadsResponse.data.leads.length;
      const newLeadsCount = leadsResponse.data.leads.filter((lead) => lead.status === 'NEW').length;

      setStats({
        customers: customersCount,
        leads: leadsCount,
        newLeads: newLeadsCount,
      });
    } catch (error) {
      if (error.response?.status === 401) {
        await handleUnauthorized();
        Alert.alert('Session Expired', 'Please login again.');
      } else {
        Alert.alert('Error', 'Failed to load dashboard data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const handleLogout = async () => {
    await handleUnauthorized();
    Alert.alert('Logged Out', 'You have been logged out.');
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <Animated.View
        entering={FadeInUp.duration(500).easing(Easing.out(Easing.exp))}
        className="bg-blue-600 p-6 shadow-lg">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-white">Welcome, {user?.name || 'User'}!</Text>
            <Text className="mt-1 text-lg text-white">Your CRM Dashboard</Text>
          </View>
          <Pressable onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="white" />
          </Pressable>
        </View>
      </Animated.View>

      <View className="p-6">
        {loading ? (
          <View className="h-64 flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-4 text-xl text-gray-600">Loading...</Text>
          </View>
        ) : (
          <View className="flex-col">
            <Animated.View
              entering={FadeInUp.delay(100).duration(500).easing(Easing.out(Easing.exp))}
              className="mb-6 rounded-2xl bg-blue-50 p-6 shadow-lg">
              <Animated.View style={animatedCustomersStyle}>
                <Pressable
                  onPress={() => navigation.navigate('Customers')}
                  onPressIn={() => handlePressIn(scaleCustomers)}
                  onPressOut={() => handlePressOut(scaleCustomers)}>
                  <View className="mb-3 flex-row items-center">
                    <Ionicons name="people-outline" size={32} color="#3B82F6" />
                    <Text className="ml-3 text-xl font-semibold text-gray-800">Customers</Text>
                  </View>
                  <Text className="text-4xl font-bold text-blue-600">{stats.customers}</Text>
                  <Text className="mt-2 text-base text-gray-600">Active Customers</Text>
                </Pressable>
              </Animated.View>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(200).duration(500).easing(Easing.out(Easing.exp))}
              className="mb-6 rounded-2xl bg-green-50 p-6 shadow-lg">
              <Animated.View style={animatedTotalLeadsStyle}>
                <Pressable
                  onPress={() => navigation.navigate('Leads')}
                  onPressIn={() => handlePressIn(scaleTotalLeads)}
                  onPressOut={() => handlePressOut(scaleTotalLeads)}>
                  <View className="mb-3 flex-row items-center">
                    <Ionicons name="briefcase-outline" size={32} color="#15803D" />
                    <Text className="ml-3 text-xl font-semibold text-gray-800">Total Leads</Text>
                  </View>
                  <Text className="text-4xl font-bold text-green-600">{stats.leads}</Text>
                  <Text className="mt-2 text-base text-gray-600">All Leads</Text>
                </Pressable>
              </Animated.View>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(300).duration(500).easing(Easing.out(Easing.exp))}
              className="mb-6 rounded-2xl bg-yellow-50 p-6 shadow-lg">
              <Animated.View style={animatedNewLeadsStyle}>
                <Pressable
                  onPress={() => navigation.navigate('Leads')}
                  onPressIn={() => handlePressIn(scaleNewLeads)}
                  onPressOut={() => handlePressOut(scaleNewLeads)}>
                  <View className="mb-3 flex-row items-center">
                    <Ionicons name="star-outline" size={32} color="#D97706" />
                    <Text className="ml-3 text-xl font-semibold text-gray-800">New Leads</Text>
                  </View>
                  <Text className="text-4xl font-bold text-yellow-600">{stats.newLeads}</Text>
                  <Text className="mt-2 text-base text-gray-600">Pending Follow-Ups</Text>
                </Pressable>
              </Animated.View>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(400).duration(500).easing(Easing.out(Easing.exp))}
              className="mt-6 flex-row justify-between">
              <Pressable
                className="mr-2 flex-1 flex-row items-center justify-center rounded-xl bg-blue-500 p-5 shadow-lg"
                onPress={() => navigation.navigate('Customers', { screen: 'Customer' })}>
                <Ionicons name="person-add-outline" size={28} color="white" />
                <Text className="ml-2 text-lg font-semibold text-white">Add Customer</Text>
              </Pressable>
              <Pressable
                className="ml-2 flex-1 flex-row items-center justify-center rounded-xl bg-green-500 p-5 shadow-lg"
                onPress={() => navigation.navigate('Leads', { screen: 'Lead' })}>
                <Ionicons name="briefcase-outline" size={28} color="white" />
                <Text className="ml-2 text-lg font-semibold text-white">Add Lead</Text>
              </Pressable>
            </Animated.View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
