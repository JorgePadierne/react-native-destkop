import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Integrante} from '../types';
import {useTheme} from '../context/ThemeContext';

interface MemberHeaderProps {
  integrante: Integrante;
}

const MemberHeader: React.FC<MemberHeaderProps> = ({integrante}) => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.headerCard,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.cardShadow,
        },
      ]}>
      <View
        style={[styles.avatarPlaceholder, {backgroundColor: colors.primary}]}>
        <Text style={styles.avatarText}>
          {integrante.nombre_apellidos.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.headerInfo}>
        <Text style={[styles.name, {color: colors.text}]}>
          {integrante.nombre_apellidos}
        </Text>
        <View
          style={[
            styles.statusBadge,
            integrante.fecha_baja_tmp
              ? styles.statusInactive
              : styles.statusActive,
            {
              backgroundColor: integrante.fecha_baja_tmp
                ? '#FEE2E2'
                : colors.secondary + '20', // 20% opacity
            },
          ]}>
          <Text
            style={[
              styles.statusText,
              integrante.fecha_baja_tmp
                ? styles.statusTextInactive
                : {color: colors.secondary},
            ]}>
            {integrante.fecha_baja_tmp ? 'INACTIVO' : 'ACTIVO'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    margin: 20,
    borderRadius: 20,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    // Dynamic background handled in component
  },
  statusInactive: {
    // Dynamic background handled in component
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusTextInactive: {
    color: '#EF4444',
  },
});

export default MemberHeader;
