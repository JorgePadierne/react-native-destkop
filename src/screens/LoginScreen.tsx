// /src/screens/LoginScreen.tsx
import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, ActivityIndicator} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {useAuth} from '../context/AuthContext';

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
  route: RouteProp<RootStackParamList, 'Login'>;
}

const LoginScreen: React.FC<Props> = () => {
  const {login, loading} = useAuth();
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setError(null);
      await login(usuario, contraseña);
    } catch (e) {
      setError('No se pudo iniciar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
        style={styles.input}
        placeholderTextColor="#666"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={contraseña}
        onChangeText={setContraseña}
        style={styles.input}
        placeholderTextColor="#666"
        secureTextEntry
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {loading ? (
        <ActivityIndicator size="small" color="#0052A5" />
      ) : (
        <Button title="Entrar" onPress={handleLogin} color="#00853E" />
      )}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E8F4FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#D72638',
  },
  input: {
    borderWidth: 1,
    borderColor: '#0052A5',
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  card: {
    width: '85%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  errorText: {color: '#D72638', marginBottom: 10, textAlign: 'center'},
});
