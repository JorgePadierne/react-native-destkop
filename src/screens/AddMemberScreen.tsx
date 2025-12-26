import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {createIntegrantesApi} from '../api/integrantes';
import {useTheme} from '../context/ThemeContext';
import {useAxios} from '../context/AxiosContext';

const AddMemberScreen = () => {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {axiosInstance, token} = useAxios();
  const integrantesApi = React.useMemo(
    () => createIntegrantesApi(axiosInstance, token),
    [axiosInstance, token],
  );
  const [nombreApellidos, setNombreApellidos] = useState('');
  const [fechaAlta, setFechaAlta] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nombreApellidos.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    if (!fechaAlta.trim()) {
      Alert.alert('Error', 'La fecha de alta es obligatoria');
      return;
    }

    try {
      setLoading(true);
      await integrantesApi.create({
        nombre_apellidos: nombreApellidos,
        fecha_alta_tmp: fechaAlta,
        fecha_baja_tmp: null,
        activo: true,
      });
      Alert.alert('Éxito', 'Integrante agregado correctamente', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el integrante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View
        style={[
          styles.card,
          {backgroundColor: colors.surface, shadowColor: colors.cardShadow},
        ]}>
        <Text style={[styles.title, {color: colors.primary}]}>
          Nuevo Integrante
        </Text>
        <Text style={[styles.subtitle, {color: colors.textLight}]}>
          Ingresa los datos del nuevo asociado
        </Text>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, {color: colors.textLight}]}>
            Nombre Completo
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
            value={nombreApellidos}
            onChangeText={setNombreApellidos}
            placeholder="Ej. Juan Perez"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, {color: colors.textLight}]}>
            Fecha de Alta
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
            value={fechaAlta}
            onChangeText={setFechaAlta}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            {backgroundColor: colors.primary, shadowColor: colors.primary},
          ]}
          onPress={handleSave}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Integrante</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 30,
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
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddMemberScreen;
