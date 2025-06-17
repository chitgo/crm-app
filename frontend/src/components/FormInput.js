import React, { useState } from 'react';
import { TextInput, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';

const FormInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error = '',
  iconName,
  animationDelay = 0,
  animationDuration = 500,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Animated.View
      entering={FadeInUp.delay(animationDelay)
        .duration(animationDuration)
        .easing(Easing.out(Easing.exp))}
      className="mb-6">
      {label && <Text className="mb-2 text-lg font-semibold text-gray-800">{label}</Text>}

      <View
        className={`flex-row items-center rounded-xl border bg-white px-2 py-1 shadow-sm ${
          isFocused ? 'border-blue-500' : error ? 'border-red-500' : 'border-gray-300'
        }`}>
        {iconName && <Ionicons name={iconName} size={24} color="#6B7280" className="mr-3" />}
        <TextInput
          className="flex-1 text-lg text-gray-800"
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          {...props}
        />
      </View>

      {error ? <Text className="mt-2 text-sm text-red-500">{error}</Text> : null}
    </Animated.View>
  );
};

export default FormInput;
