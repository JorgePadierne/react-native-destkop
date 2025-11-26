// /src/components/IntegranteForm.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Integrante, IntegranteCreateInput} from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onGuardar: (data: IntegranteCreateInput) => void;
  integrante?: Integrante; // Si se está editando
}

const IntegranteForm: React.FC<Props> = ({
  visible,
  onClose,
  onGuardar,
  integrante,
}) => {
  const [nombre, setNombre] = useState(integrante?.nombre || '');
  const [alta, setAlta] = useState(integrante?.alta || '');
  const [baja, setBaja] = useState(integrante?.baja || '');

  const handleGuardar = () => {
    if (!nombre || !alta) {
      Alert.alert('Campos obligatorios', 'Nombre y fecha de alta son obligatorios');
      return;
    }
    onGuardar({nombre, alta, baja: baja || null});
    setNombre('');
    setAlta('');
    setBaja('');
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {integrante ? 'Editar' : 'Agregar'} Integrante
        </Text>
        <TextInput
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TextInput
          placeholder="Fecha de Alta (YYYY-MM-DD)"
          value={alta}
          onChangeText={setAlta}
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TextInput
          placeholder="Fecha de Baja (opcional)"
          value={baja}
          onChangeText={setBaja}
          style={styles.input}
          placeholderTextColor="#666"
        />
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleGuardar}>
            <Text style={styles.buttonTextPrimary}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={onClose}>
            <Text style={styles.buttonTextSecondary}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default IntegranteForm;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000066',
    zIndex: 10,
  },
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 14,
    width: '80%',
    maxWidth: 420,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#0052A5',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#0052A5',
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    color: '#000',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonPrimary: {
    backgroundColor: '#00853E',
  },
  buttonSecondary: {
    backgroundColor: '#D72638',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
