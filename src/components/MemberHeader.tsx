import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
import {Integrante} from '../types';

interface MemberHeaderProps {
  integrante: Integrante;
}

const MemberHeader: React.FC<MemberHeaderProps> = ({integrante}) => {
  return (
    <View style={styles.headerCard}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {integrante.nombre.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.headerName}>{integrante.nombre}</Text>
      <Text
        style={[
          styles.statusBadge,
          integrante.baja ? styles.statusInactive : styles.statusActive,
        ]}>
        {integrante.baja ? 'INACTIVO' : 'ACTIVO'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: colors.primary,
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusActive: {backgroundColor: colors.secondary},
  statusInactive: {backgroundColor: colors.danger},
});

export default MemberHeader;
