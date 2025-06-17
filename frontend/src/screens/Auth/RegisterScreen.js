import { API_URL } from '@env';
import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import FormInput from '../../components/FormInput';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const url = `${API_URL}/api/auth/register`;


      const response = await axios.post(
        url,
        {
          name,
          email,
          password,
        },
        {
          timeout: 10000,
        }
      );

      Alert.alert('Success', 'Account created successfully! Please log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data.error || 'Registration failed');
      } else if (error.request) {
        Alert.alert('Error', 'Network error. Check server connection or URL.');
      } else {
        Alert.alert('Error', error.message || 'Something went wrong');
      }
    }
  };

  return (
    <View className="flex-1 justify-center bg-gray-100 p-4">
      <Text className="mb-6 text-center text-2xl font-bold">Create Account</Text>

      <FormInput label="Name" placeholder="Enter your name" value={name} onChangeText={setName} />

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

      <Pressable className="mt-2 rounded-lg bg-blue-500 p-3" onPress={handleRegister}>
        <Text className="text-center text-lg font-semibold text-white">Register</Text>
      </Pressable>

      <Pressable className="mt-4" onPress={() => navigation.navigate('Login')}>
        <Text className="text-center text-blue-500">Already have an account? Login</Text>
      </Pressable>
    </View>
  );
};

export default RegisterScreen;
