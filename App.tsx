import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import MemberDetailsScreen from './src/screens/MemberDetailsScreen';
import AddMemberScreen from './src/screens/AddMemberScreen';
import {AuthProvider, useAuth} from './src/context/AuthContext';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';

// Tipado de las pantallas del stack
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  MemberDetails: {integranteId: string};
  AddMember: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const {user} = useAuth();
  const {colors, isDarkMode} = useTheme();

  const navigationTheme = isDarkMode ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerTitleAlign: 'center',
        }}>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{title: 'ASOCIACIÓN TOCORORO'}}
            />
            <Stack.Screen
              name="MemberDetails"
              component={MemberDetailsScreen}
              options={{title: 'Detalles del Integrante'}}
            />
            <Stack.Screen
              name="AddMember"
              component={AddMemberScreen}
              options={{title: 'Agregar Integrante'}}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{title: 'ASOCIACIÓN TOCORORO'}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
