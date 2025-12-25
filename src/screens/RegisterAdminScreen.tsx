import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {createAuthApi} from '../api/auth';
import {useTheme} from '../context/ThemeContext';
import {useAxios} from '../context/AxiosContext';

const RegisterAdminScreen = () => {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {axiosInstance} = useAxios();
  const authApi = React.useMemo(
    () => createAuthApi(axiosInstance),
    [axiosInstance],
  );

  const [nombreAdmin, setNombreAdmin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'SUPERADMIN' | 'ADMIN' | 'USER'>('USER');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validations
    if (!nombreAdmin.trim()) {
      Alert.alert('Error', 'El nombre de administrador es obligatorio');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'La contraseña es obligatoria');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      await authApi.register({
        nombre_admin: nombreAdmin,
        password: password,
        role: role,
      });
      Alert.alert('Éxito', 'Administrador registrado correctamente', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View
        style={[
          styles.card,
          {backgroundColor: colors.surface, shadowColor: colors.cardShadow},
        ]}>
        <Text style={[styles.title, {color: colors.primary}]}>
          Registrar Administrador
        </Text>
        <Text style={[styles.subtitle, {color: colors.textLight}]}>
          Crear una nueva cuenta de administrador
        </Text>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, {color: colors.textLight}]}>
            Nombre de Usuario
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={nombreAdmin}
            onChangeText={setNombreAdmin}
            placeholder="Ej. admin_usuario"
            placeholderTextColor={colors.textLight}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, {color: colors.textLight}]}>
            Contraseña
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={colors.textLight}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, {color: colors.textLight}]}>
            Confirmar Contraseña
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repite la contraseña"
            placeholderTextColor={colors.textLight}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, {color: colors.textLight}]}>Rol</Text>
          <View style={styles.roleContainer}>
            {(['USER', 'ADMIN', 'SUPERADMIN'] as const).map(r => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.roleButton,
                  {
                    backgroundColor:
                      role === r ? colors.primary : colors.inputBg,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setRole(r)}>
                <Text
                  style={[
                    styles.roleText,
                    {color: role === r ? '#fff' : colors.text},
                  ]}>
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.registerButton,
            {backgroundColor: colors.primary, shadowColor: colors.primary},
          ]}
          onPress={handleRegister}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>
              Registrar Administrador
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 16,
    padding: 30,
    marginTop: 20,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  fieldContainer: {marginBottom: 20},
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  registerButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RegisterAdminScreen;
