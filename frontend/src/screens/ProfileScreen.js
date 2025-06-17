import React, { useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="mt-10 items-center">
        <Ionicons name="person-circle-outline" size={120} color="#3B82F6" />
        <Text className="mt-4 text-2xl font-bold text-gray-800">{user?.name || 'User'}</Text>
        <Text className="text-lg text-gray-600">{user?.email || 'No email'}</Text>
      </View>

      <View className="mt-10 px-4">
        <View className="mb-4 rounded-lg bg-white p-4 shadow">
          <Text className="text-lg font-semibold text-gray-700">Profile Details</Text>
          <View className="mt-2">
            <Text className="text-gray-600">Name: {user?.name}</Text>
            <Text className="text-gray-600">Email: {user?.email}</Text>
            <Text className="text-gray-600">User ID: {user?.id}</Text>
          </View>
        </View>

        <Pressable className="items-center rounded-lg bg-red-500 p-3" onPress={handleLogout}>
          <Text className="text-lg font-semibold text-white">Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ProfileScreen;
