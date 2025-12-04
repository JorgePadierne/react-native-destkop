import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {colors} from '../theme/colors';
import {Integrante} from '../types';

interface MemberInfoCardProps {
  integrante: Integrante;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: (data: {nombre: string; alta: string; baja: string | null}) => void;
  onDelete: () => void;
}

const MemberInfoCard: React.FC<MemberInfoCardProps> = ({
  integrante,
  isEditing,
  onEditToggle,
  onSave,
  onDelete,
}) => {
  const [nombre, setNombre] = useState(integrante.nombre);
  const [alta, setAlta] = useState(integrante.alta);
  const [baja, setBaja] = useState<string | null>(integrante.baja || null);

  useEffect(() => {
    setNombre(integrante.nombre);
    setAlta(integrante.alta);
    setBaja(integrante.baja || null);
  }, [integrante]);

  const handleSavePress = () => {
    onSave({nombre, alta, baja});
  };

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        <TouchableOpacity onPress={isEditing ? handleSavePress : onEditToggle}>
          <Text style={styles.editButton}>
            {isEditing ? 'Guardar' : 'Editar'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fieldRow}>
        <Text style={styles.label}>Nombre</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
          />
        ) : (
          <Text style={styles.value}>{integrante.nombre}</Text>
        )}
      </View>

      <View style={styles.fieldRow}>
        <Text style={styles.label}>Fecha de Alta</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={alta}
            onChangeText={setAlta}
            placeholder="YYYY-MM-DD"
          />
        ) : (
          <Text style={styles.value}>{integrante.alta}</Text>
        )}
      </View>

      <View style={styles.fieldRow}>
        <Text style={styles.label}>Fecha de Baja</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={baja || ''}
            onChangeText={setBaja}
            placeholder="YYYY-MM-DD (Opcional)"
          />
        ) : (
          <Text style={styles.value}>{integrante.baja || '-'}</Text>
        )}
      </View>

      {!isEditing && !integrante.baja && (
        <TouchableOpacity style={styles.bajaButton} onPress={onDelete}>
          <Text style={styles.bajaButtonText}>Dar de Baja</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  editButton: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  fieldRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.inputBg,
  },
  bajaButton: {
    backgroundColor: '#FEE2E2',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  bajaButtonText: {
    color: colors.danger,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MemberInfoCard;
