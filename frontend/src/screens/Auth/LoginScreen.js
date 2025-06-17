import { API_URL } from '@env';
import React, { useState, useContext } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import FormInput from '../../components/FormInput';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      await login(token, user);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Network error. Check server connection.'
      );
    }
  };

  return (
    <View className="flex-1 justify-center bg-gray-100 p-4">
      <Text className="mb-6 text-center text-2xl font-bold">Login to CRM</Text>

      <FormInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <FormInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable className="mt-2 rounded-lg bg-blue-500 p-3" onPress={handleLogin}>
        <Text className="text-center text-lg font-semibold text-white">Login</Text>
      </Pressable>

      <Pressable className="mt-4" onPress={() => navigation.navigate('Register')}>
        <Text className="text-center text-blue-500">Don't have an account? Register</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;
