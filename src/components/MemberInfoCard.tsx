import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Integrante} from '../types';
import {useTheme} from '../context/ThemeContext';

interface MemberInfoCardProps {
  integrante: Integrante;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: (data: {
    nombre_apellidos: string;
    fecha_alta_tmp: string;
    fecha_baja_tmp: string | null;
  }) => void;
  onDelete: () => void;
  onPermanentDelete?: () => void;
  onActivate?: () => void;
  isReadOnly?: boolean;
}

const MemberInfoCard: React.FC<MemberInfoCardProps> = ({
  integrante,
  isEditing,
  onEditToggle,
  onSave,
  onDelete,
  onPermanentDelete,
  onActivate,
  isReadOnly = false,
}) => {
  const {colors} = useTheme();
  const [editName, setEditName] = React.useState(integrante.nombre_apellidos);
  const [editAlta, setEditAlta] = React.useState(integrante.fecha_alta_tmp);

  const handleSavePress = () => {
    onSave({
      nombre_apellidos: editName,
      fecha_alta_tmp: editAlta,
      fecha_baja_tmp: integrante.fecha_baja_tmp || null,
    });
  };

  return (
    <View
      style={[
        styles.card,
        {backgroundColor: colors.surface, shadowColor: colors.cardShadow},
      ]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          Información Personal
        </Text>
        {!isReadOnly && (
          <TouchableOpacity
            style={[
              styles.editButton,
              {backgroundColor: isEditing ? colors.secondary : colors.primary},
            ]}
            onPress={isEditing ? handleSavePress : onEditToggle}>
            <Text style={styles.editButtonText}>
              {isEditing ? 'Guardar' : 'Editar'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.label, {color: colors.textLight}]}>Nombre:</Text>
        {isEditing ? (
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={editName}
            onChangeText={setEditName}
          />
        ) : (
          <Text style={[styles.value, {color: colors.text}]}>
            {integrante.nombre_apellidos}
          </Text>
        )}
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.label, {color: colors.textLight}]}>
          Fecha de Alta:
        </Text>
        {isEditing ? (
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={editAlta}
            onChangeText={setEditAlta}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textLight}
          />
        ) : (
          <Text style={[styles.value, {color: colors.text}]}>
            {integrante.fecha_alta_tmp}
          </Text>
        )}
      </View>

      {integrante.fecha_baja_tmp && (
        <View style={styles.infoRow}>
          <Text style={[styles.label, {color: colors.textLight}]}>
            Fecha de Baja:
          </Text>
          <Text style={[styles.value, {color: colors.danger}]}>
            {integrante.fecha_baja_tmp}
          </Text>
        </View>
      )}

      {isEditing && (
        <>
          {integrante.fecha_baja_tmp ? (
            <TouchableOpacity
              style={[
                styles.deleteButton,
                {
                  backgroundColor: colors.secondary,
                  borderColor: colors.secondary,
                },
              ]}
              onPress={onActivate}>
              <Text style={styles.activateButtonText}>Dar de Alta</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.deleteButton, {borderColor: colors.danger}]}
              onPress={onDelete}>
              <Text style={[styles.deleteButtonText, {color: colors.danger}]}>
                Dar de Baja
              </Text>
            </TouchableOpacity>
          )}

          {onPermanentDelete && (
            <TouchableOpacity
              style={[
                styles.deleteButton,
                {backgroundColor: colors.danger, borderColor: colors.danger},
              ]}
              onPress={onPermanentDelete}>
              <Text style={styles.permanentDeleteButtonText}>
                Eliminar Permanentemente
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontWeight: 'bold',
  },
  activateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  permanentDeleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MemberInfoCard;
