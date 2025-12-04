import React, {useState} from 'react';
import {colors} from '../theme/colors';
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
import {addIntegrante} from '../api/integrantes';

const AddMemberScreen = () => {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('');
  const [alta, setAlta] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    if (!alta.trim()) {
      Alert.alert('Error', 'La fecha de alta es obligatoria');
      return;
    }

    try {
      setLoading(true);
      await addIntegrante({
        nombre,
        alta,
        baja: null,
      });
      Alert.alert('Éxito', 'Integrante agregado correctamente', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
      Alert.alert('Error', 'No se pudo agregar el integrante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Nuevo Integrante</Text>
        <Text style={styles.subtitle}>
          Ingresa los datos del nuevo asociado
        </Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Juan Perez"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Fecha de Alta</Text>
          <TextInput
            style={styles.input}
            value={alta}
            onChangeText={setAlta}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
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
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 30,
  },
  fieldContainer: {marginBottom: 20},
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.inputBg,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: colors.primary,
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
