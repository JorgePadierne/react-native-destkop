import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Integrante} from '../types';
import {RootStackParamList} from '../../App';
import {colors} from '../theme/colors';
import {calculateDebtStatus} from '../utils/finance';

interface HomeTableProps {
  integrantes: Integrante[];
  loading: boolean;
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

function HomeTable({integrantes, loading}: HomeTableProps) {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const renderItem = ({item}: {item: Integrante}) => {
    const status = calculateDebtStatus(item);
    const isClean = status === 'AL_DIA';

    return (
      <View style={styles.rowContainer}>
        <View style={styles.statusCell}>
          <View
            style={[
              styles.statusIndicator,
              isClean ? styles.statusClean : styles.statusDebt,
            ]}
          />
        </View>
        <Text style={styles.nameCell} numberOfLines={1}>
          {item.nombre}
        </Text>
        <View style={styles.actionCell}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() =>
              navigation.navigate('MemberDetails', {integranteId: item.id})
            }>
            <Text style={styles.detailsButtonText}>Ver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading && integrantes.length === 0) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando integrantes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, styles.statusHeader]}>Estado</Text>
        <Text style={[styles.headerText, styles.nameHeader]}>Nombre</Text>
        <Text style={[styles.headerText, styles.actionHeader]}>Acción</Text>
      </View>

      {integrantes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se encontraron integrantes.</Text>
        </View>
      ) : (
        <FlatList
          data={integrantes}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: colors.textLight,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: colors.textLight,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  statusHeader: {
    width: 60,
    textAlign: 'center',
  },
  nameHeader: {
    flex: 1,
    paddingLeft: 10,
  },
  actionHeader: {
    width: 60,
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusCell: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusClean: {
    backgroundColor: colors.secondary, // Green
  },
  statusDebt: {
    backgroundColor: colors.danger, // Red
  },
  nameCell: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingLeft: 10,
    fontWeight: '500',
  },
  actionCell: {
    width: 60,
    alignItems: 'center',
  },
  detailsButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textLight,
    fontSize: 16,
  },
  flatListContent: {
    paddingBottom: 20,
  },
});

export default HomeTable;
