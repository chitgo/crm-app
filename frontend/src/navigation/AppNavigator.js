import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CustomerListScreen from '../screens/CustomerListScreen';
import CustomerScreen from '../screens/CustomerScreen';
import EditCustomerScreen from '../screens/EditCustomerScreen';
import LeadListScreen from '../screens/LeadListScreen';
import LeadScreen from '../screens/LeadScreen';
import EditLeadScreen from '../screens/EditLeadScreen';
import LeadDetailsScreen from '../screens/LeadDetailsScreen';
import InteractionScreen from '../screens/InteractionScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { View, Text } from 'react-native';
import CustomerDetailsScreen from '../screens/CustomerDetailsScreen';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="DashboardHome"
      component={DashboardScreen}
      options={{ title: 'Dashboard' }}
    />
  </Stack.Navigator>
);

const CustomerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="CustomerList"
      component={CustomerListScreen}
      options={{ title: 'Customers' }}
    />
    <Stack.Screen
      name="Customer"
      component={CustomerScreen}
      options={{ title: 'Add New Customer' }}
    />
    <Stack.Screen
      name="EditCustomer"
      component={EditCustomerScreen}
      options={{ title: 'Edit Customer' }}
    />
    <Stack.Screen
      name="CustomerDetails"
      component={CustomerDetailsScreen}
      options={{ title: 'Customer Details' }}
    />
  </Stack.Navigator>
);

const LeadStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="LeadList" component={LeadListScreen} options={{ title: 'Leads' }} />
    <Stack.Screen name="Lead" component={LeadScreen} options={{ title: 'Add New Lead' }} />
    <Stack.Screen name="EditLead" component={EditLeadScreen} options={{ title: 'Edit Lead' }} />
    <Stack.Screen
      name="LeadDetailsScreen"
      component={LeadDetailsScreen}
      options={{ title: 'Lead Details' }}
    />
  </Stack.Navigator>
);

const InteractionStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="Interaction"
      component={InteractionScreen}
      options={{ title: 'Add New Interaction' }}
    />
  </Stack.Navigator>
);

const MainNavigator = () => (
  <Tabs.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#3B82F6',
      tabBarInactiveTintColor: '#6B7280',
      tabBarStyle: { backgroundColor: '#F3F4F6' },
    }}>
    <Tabs.Screen
      name="Home"
      component={DashboardStack}
      options={{
        title: 'Dashboard',
        tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
      }}
    />
    <Tabs.Screen
      name="Customers"
      component={CustomerStack}
      options={{
        title: 'Customers',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="people-outline" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="Leads"
      component={LeadStack}
      options={{
        title: 'Leads',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="briefcase-outline" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="Interactions"
      component={InteractionStack}
      options={{
        title: 'Interactions',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="document-text-outline" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
  </Tabs.Navigator>
);

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
