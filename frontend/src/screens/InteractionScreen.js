import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';

const InteractionScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-5">
      <Animated.View
        entering={FadeInUp.delay(100).duration(500).easing(Easing.out(Easing.exp))}
        className="flex-row items-center justify-center">
        <Ionicons name="information-circle-outline" size={28} color="#3B82F6" className="mr-2" />
        <Text className="text-center text-2xl font-semibold text-blue-500">
          Interactions: Coming Soon!
        </Text>
      </Animated.View>
    </View>
  );
};

export default InteractionScreen;
