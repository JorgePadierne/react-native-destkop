// App.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import {AuthProvider, useAuth} from './src/context/AuthContext';

// Tipado de las pantallas del stack
export type RootStackParamList = {
  Home: undefined;
  Login: undefined; // puedes agregar más pantallas después
  Cuotas?: {integranteId: string};
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const {user} = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: '#6200EE'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}>
        {user ? (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'ASOCIACION TOCORORO'}}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{title: 'Iniciar sesión'}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

export default App;
