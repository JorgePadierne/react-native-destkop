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
import RegisterAdminScreen from './src/screens/RegisterAdminScreen';
import AccountingScreen from './src/screens/AccountingScreen';
import {AuthProvider, useAuth} from './src/context/AuthContext';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import {AxiosProvider} from './src/context/AxiosContext';

// Tipado de las pantallas del stack
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  MemberDetails: {integranteId: number};
  AddMember: undefined;
  RegisterAdmin: undefined;
  Accounting: undefined;
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
            <Stack.Screen
              name="RegisterAdmin"
              component={RegisterAdminScreen}
              options={{title: 'Registrar Administrador'}}
            />
            <Stack.Screen
              name="Accounting"
              component={AccountingScreen}
              options={{title: 'Contabilidad de la Asociación'}}
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
    <AxiosProvider>
      <AuthProvider>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </AuthProvider>
    </AxiosProvider>
  );
};

export default App;
