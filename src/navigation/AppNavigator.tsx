import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import AparelhosScreen from '../screens/AparelhosScreen';
import ListaAparelhosScreen from '../screens/ListaAparelhosScreen';
import AdicionarFeedbackScreen from '../screens/AdicionarFeedbackScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          shadowColor: '#dcdcdc', 
        },
        headerTintColor: '#333333', 
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ title: 'Registrar Usuário' }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Menu Principal', headerShown: true }}
      />
      <Stack.Screen
        name="FeedbackScreen"
        component={FeedbackScreen}
        options={{ title: 'Feedbacks' }}
      />
      <Stack.Screen
        name="AparelhosScreen"
        component={AparelhosScreen}
        options={{ title: 'Registrar Aparelhos' }}
      />
      <Stack.Screen
        name="ListaAparelhosScreen"
        component={ListaAparelhosScreen}
        options={{ title: 'Histórico de Aparelhos' }}
      />
      <Stack.Screen
        name="AdicionarFeedbackScreen"
        component={AdicionarFeedbackScreen}
        options={{ title: 'Adicionar Feedback' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;