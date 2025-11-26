// /src/screens/HomeScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import IntegranteItem from '../components/IntegranteItem';
import IntegranteForm from '../components/IntegranteForm';
import {Integrante, IntegranteCreateInput} from '../types';
import {useAuth} from '../context/AuthContext';
import {
  getIntegrantes,
  addIntegrante,
  updateIntegrante,
  deleteIntegrante,
  updateCuotas,
} from '../api/integrantes';

const HomeScreen: React.FC = () => {
  const {logout} = useAuth();
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIntegrante, setEditingIntegrante] = useState<Integrante | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState<'todos' | 'activos' | 'baja'>(
    'todos',
  );
  const [filterDeuda, setFilterDeuda] = useState<
    'todos' | 'deudores' | 'noDeudores'
  >('todos');
  const [darkMode, setDarkMode] = useState(false);

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

  // Abrir modal para agregar
  const handleAgregar = () => {
    setEditingIntegrante(null);
    setSearch('');
    setFilterEstado('todos');
    setFilterDeuda('todos');
    setModalVisible(true);
  };

  // Abrir modal para editar
  const handleEditar = (integrante: Integrante) => {
    setEditingIntegrante(integrante);
    setModalVisible(true);
  };

  // Eliminar integrante
  const handleEliminar = async (integrante: Integrante) => {
    try {
      await deleteIntegrante(integrante.id);
      setIntegrantes(prev => prev.filter(i => i.id !== integrante.id));
    } catch (e) {
      setError('No se pudo eliminar el integrante');
    }
  };

  // Guardar cuotas por integrante
  const handleGuardarCuotas = async (
    id: string,
    anio: number,
    cuotas: boolean[],
  ) => {
    try {
      const actualizado = await updateCuotas(id, anio, cuotas);
      if (actualizado) {
        setIntegrantes(prev =>
          prev.map(i => (i.id === id ? actualizado : i)),
        );
      }
    } catch (e) {
      setError('No se pudieron guardar las cuotas');
    }
  };

  // Guardar nuevo o editar existente
  const handleGuardarIntegrante = async (
    data: IntegranteCreateInput,
  ) => {
    try {
      if (editingIntegrante) {
        const actualizado = await updateIntegrante(editingIntegrante.id, data);
        if (actualizado) {
          setIntegrantes(prev =>
            prev.map(i => (i.id === editingIntegrante.id ? actualizado : i)),
          );
        }
      } else {
        const nuevo = await addIntegrante(data);
        setIntegrantes(prev => [...prev, nuevo]);
      }
    } catch (e) {
      setError('No se pudo guardar el integrante');
    }
  };

  const esDeudor = (integrante: Integrante): boolean => {
    if (!integrante.cuotasPorAnio || integrante.cuotasPorAnio.length === 0) {
      return false;
    }
    // Deudor si tiene al menos una cuota sin pagar (false) en cualquier año
    return integrante.cuotasPorAnio.some(reg => reg.meses.some(c => !c));
  };

  const integrantesFiltrados = integrantes
    .filter(i => {
      const nombreMatch = i.nombre
        .toLowerCase()
        .includes(search.toLowerCase());

      const activo = !i.baja;
      const estadoMatch =
        filterEstado === 'todos' ||
        (filterEstado === 'activos' && activo) ||
        (filterEstado === 'baja' && !activo);

      const deudor = esDeudor(i);
      const deudaMatch =
        filterDeuda === 'todos' ||
        (filterDeuda === 'deudores' && deudor) ||
        (filterDeuda === 'noDeudores' && !deudor);

      return nombreMatch && estadoMatch && deudaMatch;
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, darkMode && styles.titleDark]}>
          Gestión de Integrantes
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerAddButton, darkMode && styles.headerAddButtonDark]}
            onPress={handleAgregar}>
            <Text style={styles.headerAddButtonText}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeToggle, darkMode && styles.modeToggleActive]}
            onPress={() => setDarkMode(prev => !prev)}>
            <Text
              style={[
                styles.modeToggleText,
                darkMode && styles.modeToggleTextActive,
              ]}>
              {darkMode ? '☾' : '☼'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Buscador y filtros */}
      <View
        style={[
          styles.filtersContainer,
          darkMode && styles.filtersContainerDark,
        ]}>
        <TextInput
          placeholder="Buscar por nombre"
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, darkMode && styles.searchInputDark]}
          placeholderTextColor="#666"
        />
        <View style={styles.filterRow}>
          <Text
            style={[styles.filterLabel, darkMode && styles.filterLabelDark]}>
            Estado:
          </Text>
          <View style={styles.filterChipsRow}>
            <TouchableOpacity
              style={[
                styles.chip,
                filterEstado === 'todos' && styles.chipActive,
              ]}
              onPress={() => setFilterEstado('todos')}>
              <Text
                style={[
                  styles.chipText,
                  filterEstado === 'todos' && styles.chipTextActive,
                ]}>
                Todos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chip,
                filterEstado === 'activos' && styles.chipActive,
              ]}
              onPress={() => setFilterEstado('activos')}>
              <Text
                style={[
                  styles.chipText,
                  filterEstado === 'activos' && styles.chipTextActive,
                ]}>
                Activos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chip,
                filterEstado === 'baja' && styles.chipActive,
              ]}
              onPress={() => setFilterEstado('baja')}>
              <Text
                style={[
                  styles.chipText,
                  filterEstado === 'baja' && styles.chipTextActive,
                ]}>
                Baja
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.filterRow}>
          <Text
            style={[styles.filterLabel, darkMode && styles.filterLabelDark]}>
            Deuda:
          </Text>
          <View style={styles.filterChipsRow}>
            <TouchableOpacity
              style={[
                styles.chip,
                filterDeuda === 'todos' && styles.chipActive,
              ]}
              onPress={() => setFilterDeuda('todos')}>
              <Text
                style={[
                  styles.chipText,
                  filterDeuda === 'todos' && styles.chipTextActive,
                ]}>
                Todos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chip,
                filterDeuda === 'deudores' && styles.chipActive,
              ]}
              onPress={() => setFilterDeuda('deudores')}>
              <Text
                style={[
                  styles.chipText,
                  filterDeuda === 'deudores' && styles.chipTextActive,
                ]}>
                Deudores
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chip,
                filterDeuda === 'noDeudores' && styles.chipActive,
              ]}
              onPress={() => setFilterDeuda('noDeudores')}>
              <Text
                style={[
                  styles.chipText,
                  filterDeuda === 'noDeudores' && styles.chipTextActive,
                ]}>
                Al día
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {loading && (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#0052A5" />
          <Text style={styles.loadingText}>Cargando integrantes...</Text>
        </View>
      )}

      {error && (
        <Text style={[styles.errorText, darkMode && styles.errorTextDark]}>
          {error}
        </Text>
      )}

      {!loading && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}>
          <View
            style={[styles.listContainer, darkMode && styles.listContainerDark]}>
            <Text style={[styles.subtitle, darkMode && styles.subtitleDark]}>
              Integrantes ({integrantesFiltrados.length})
            </Text>
            {integrantesFiltrados.length === 0 ? (
              <Text style={styles.emptyText}>
                Aún no hay integrantes, agrega el primero.
              </Text>
            ) : (
              integrantesFiltrados.map(item => (
                <IntegranteItem
                  key={item.id}
                  integrante={item}
                  onEditar={handleEditar}
                  onEliminar={handleEliminar}
                  onGuardarCuotas={(anio: number, cuotas: boolean[]) => {
                    void handleGuardarCuotas(item.id, anio, cuotas);
                  }}
                />
              ))
            )}
          </View>
        </ScrollView>
      )}

      {/* Modal para agregar o editar */}
      <IntegranteForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGuardar={handleGuardarIntegrante}
        integrante={editingIntegrante || undefined}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#F3F6FF'},
  containerDark: {backgroundColor: '#0F172A'},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 0,
    color: '#D72638',
    textAlign: 'center',
  },
  titleDark: {color: '#F9FAFB'},
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAddButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D72638',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerAddButtonDark: {
    backgroundColor: '#B91C1C',
  },
  headerAddButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
  modeToggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0052A5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  modeToggleActive: {
    backgroundColor: '#1E293B',
    borderColor: '#60A5FA',
  },
  modeToggleText: {color: '#0052A5', fontSize: 16},
  modeToggleTextActive: {color: '#F9FAFB'},
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D72638',
    backgroundColor: '#FFFFFF',
  },
  logoutText: {color: '#D72638', fontSize: 12, fontWeight: '600'},
  filtersContainer: {
    marginTop: 16,
    marginBottom: 4,
  },
  filtersContainerDark: {
    marginTop: 16,
    marginBottom: 4,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#0052A5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    color: '#000',
    marginBottom: 6,
  },
  searchInputDark: {
    backgroundColor: '#1F2937',
    borderColor: '#60A5FA',
    color: '#F9FAFB',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0052A5',
    marginRight: 6,
  },
  filterLabelDark: {
    color: '#BFDBFE',
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0052A5',
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: '#0052A5',
  },
  chipText: {
    fontSize: 12,
    color: '#0052A5',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#0052A5',
  },
  subtitleDark: {color: '#BFDBFE'},
  listContainer: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listContainerDark: {
    backgroundColor: '#111827',
    borderColor: '#1F2937',
  },
  list: {marginTop: 4},
  scroll: {marginTop: 8},
  scrollContent: {paddingBottom: 40},
  centerContent: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#0052A5',
  },
  errorText: {
    marginTop: 10,
    color: '#D72638',
    fontWeight: '600',
  },
  errorTextDark: {
    color: '#FCA5A5',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
  },
});
