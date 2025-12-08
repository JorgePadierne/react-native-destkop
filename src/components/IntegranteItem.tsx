// /src/components/IntegranteItem.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Integrante} from '../types';

interface Props {
  integrante: Integrante;
  onEditar?: (integrante: Integrante) => void;
  onEliminar?: (integrante: Integrante) => void;
  onGuardarCuotas?: (year: number, cuotas: boolean[]) => void;
}

const IntegranteItem: React.FC<Props> = ({integrante}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.nombre} numberOfLines={1}>
            {integrante.nombre_apellidos}
          </Text>
          <Text style={styles.nombre}>-</Text>
          <Text style={styles.nombre}>-</Text>
          <Text style={styles.nombre}>-</Text>
          <Text style={styles.nombre}>-</Text>
        </View>
      </View>
    </View>
  );
};

export default IntegranteItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 2,
    borderRadius: 6,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 3,
    borderLeftColor: '#0052A5',
  },
  infoContainer: {flex: 1},
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 2,
  },
  nombre: {
    fontWeight: '600',
    fontSize: 14,
    color: '#0052A5',
    flex: 1,
    textAlign: 'left',
    paddingLeft: 50,
  },
  detalleLinea: {color: '#555', fontSize: 11, marginBottom: 2},
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  badgeActivo: {backgroundColor: '#00853E33'},
  badgeBaja: {backgroundColor: '#D7263833'},
  badgeText: {fontSize: 10, fontWeight: '600', color: '#333'},
  cuotasRow: {
    marginTop: 2,
  },
  buttons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 6,
  },
});
