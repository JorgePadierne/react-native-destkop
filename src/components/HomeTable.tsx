import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';
import {getIntegrantes} from '../api/integrantes';
import IntegranteItem from '../components/IntegranteItem';
import {Integrante} from '../types';

function HomeTable() {
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cargarIntegrantes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getIntegrantes();
        setIntegrantes(data);
      } catch (e) {
        setError('Error al cargar los integrantes');
      } finally {
        setLoading(false);
      }
    };
    cargarIntegrantes();
  }, []);

  return (
    <View>
      {loading && (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#0052A5" />
          <Text style={styles.loadingText}>Cargando integrantes...</Text>
        </View>
      )}
      <View style={styles.listContainer}>
        <View style={styles.tableContainer}>
          <View>
            <Text style={styles.tableTitle}>Asociados</Text>
          </View>
          <View style={styles.tableHeader}>
            <Text style={styles.tableSubtitle}>Nombre Completo</Text>
            <Text style={styles.tableSubtitle}>Fecha de Alta</Text>
            <Text style={styles.tableSubtitle}>Fecha de Baja</Text>
            <Text style={styles.tableSubtitle}>Estado de Pago</Text>
            <Text style={styles.tableSubtitle}>Acciones</Text>
          </View>
        </View>

        {!loading && (
          <View style={styles.listContainer}>
            {integrantes.length === 0 ? (
              <Text style={styles.emptyText}>
                Aún no hay integrantes, agrega el primero.
              </Text>
            ) : (
              <FlatList
                data={integrantes}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => <IntegranteItem integrante={item} />}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  centerContent: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#0052A5',
  },
  listContainer: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 30,
    paddingBottom: 200,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableContainer: {
    paddingLeft: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    maxWidth: '60%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000000ff',
  },

  tableSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000ff',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
  },
});

export default HomeTable;
