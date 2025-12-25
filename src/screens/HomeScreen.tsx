import React, {useCallback, useState, useLayoutEffect, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAuth} from '../context/AuthContext';
import {useAxios} from '../context/AxiosContext';
import {useTheme} from '../context/ThemeContext';
import HomeTable from '../components/HomeTable';
import HomeControls from '../components/HomeControls';
import {createIntegrantesApi} from '../api/integrantes';
import {Integrante} from '../types';
import {calculateDebtStatus} from '../utils/finance';
import {RootStackParamList} from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const LogoutButton = ({onPress}: {onPress: () => void}) => (
  <TouchableOpacity onPress={onPress} style={styles.logoutButton}>
    <Text style={styles.logoutText}>Salir</Text>
  </TouchableOpacity>
);

const HomeScreen: React.FC = () => {
  const {logout} = useAuth();
  const {axiosInstance, token} = useAxios();
  const {colors, toggleTheme, isDarkMode} = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const integrantesApi = useMemo(
    () => createIntegrantesApi(axiosInstance, token),
    [axiosInstance, token],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton onPress={logout} />,
    });
  }, [navigation, logout]);

  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [filteredIntegrantes, setFilteredIntegrantes] = useState<Integrante[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'ALL' | 'ACTIVE' | 'INACTIVE'
  >('ALL');
  const [filterDebt, setFilterDebt] = useState<'ALL' | 'DEBT' | 'CLEAN'>('ALL');

  // Define applyFilters with useCallback to be stable
  const applyFilters = useCallback(
    (
      data: Integrante[],
      query: string,
      status: 'ALL' | 'ACTIVE' | 'INACTIVE',
      debt: 'ALL' | 'DEBT' | 'CLEAN',
    ) => {
      let result = data;

      // Search by name
      if (query) {
        result = result.filter(i =>
          i.nombre_apellidos.toLowerCase().includes(query.toLowerCase()),
        );
      }

      // Filter by Active/Inactive (Baja)
      if (status === 'ACTIVE') {
        result = result.filter(i => !i.fecha_baja_tmp);
      } else if (status === 'INACTIVE') {
        result = result.filter(i => i.fecha_baja_tmp);
      }

      // Filter by Debt
      if (debt === 'DEBT') {
        result = result.filter(i => calculateDebtStatus(i) === 'DEUDA');
      } else if (debt === 'CLEAN') {
        result = result.filter(i => calculateDebtStatus(i) === 'AL_DIA');
      }

      setFilteredIntegrantes(result);
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          const data = await integrantesApi.getAll();
          setIntegrantes(data);
          applyFilters(data, searchQuery, filterStatus, filterDebt);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      if (token) {
        loadData();
      } else {
        setLoading(false);
      }
    }, [
      applyFilters,
      searchQuery,
      filterStatus,
      filterDebt,
      integrantesApi,
      token,
    ]),
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    applyFilters(integrantes, text, filterStatus, filterDebt);
  };

  const handleStatusFilter = (status: 'ALL' | 'ACTIVE' | 'INACTIVE') => {
    setFilterStatus(status);
    applyFilters(integrantes, searchQuery, status, filterDebt);
  };

  const handleDebtFilter = (debt: 'ALL' | 'DEBT' | 'CLEAN') => {
    setFilterDebt(debt);
    applyFilters(integrantes, searchQuery, filterStatus, debt);
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <HomeControls
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onAddMember={() => navigation.navigate('AddMember')}
        filterStatus={filterStatus}
        onFilterStatusChange={handleStatusFilter}
        filterDebt={filterDebt}
        onFilterDebtChange={handleDebtFilter}
        colors={colors}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />

      <HomeTable integrantes={filteredIntegrantes} loading={loading} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  logoutButton: {
    marginRight: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
