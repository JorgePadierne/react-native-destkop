import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {colors} from '../theme/colors';

interface HomeControlsProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onAddMember: () => void;
  filterStatus: 'ALL' | 'ACTIVE' | 'INACTIVE';
  onFilterStatusChange: (status: 'ALL' | 'ACTIVE' | 'INACTIVE') => void;
  filterDebt: 'ALL' | 'DEBT' | 'CLEAN';
  onFilterDebtChange: (status: 'ALL' | 'DEBT' | 'CLEAN') => void;
}

const HomeControls: React.FC<HomeControlsProps> = ({
  searchQuery,
  onSearchChange,
  onAddMember,
  filterStatus,
  onFilterStatusChange,
  filterDebt,
  onFilterDebtChange,
}) => {
  return (
    <View style={styles.controlsContainer}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        <TouchableOpacity style={styles.addButton} onPress={onAddMember}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersSection}>
        <Text style={styles.filterLabel}>Estado</Text>
        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              filterStatus === 'ALL' && styles.activeFilter,
            ]}
            onPress={() => onFilterStatusChange('ALL')}>
            <Text
              style={[
                styles.filterText,
                filterStatus === 'ALL' && styles.activeFilterText,
              ]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              filterStatus === 'ACTIVE' && styles.activeFilter,
            ]}
            onPress={() => onFilterStatusChange('ACTIVE')}>
            <Text
              style={[
                styles.filterText,
                filterStatus === 'ACTIVE' && styles.activeFilterText,
              ]}>
              Activos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              filterStatus === 'INACTIVE' && styles.activeFilter,
            ]}
            onPress={() => onFilterStatusChange('INACTIVE')}>
            <Text
              style={[
                styles.filterText,
                filterStatus === 'INACTIVE' && styles.activeFilterText,
              ]}>
              Inactivos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filtersSection}>
        <Text style={styles.filterLabel}>Pagos</Text>
        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              filterDebt === 'ALL' && styles.activeFilter,
            ]}
            onPress={() => onFilterDebtChange('ALL')}>
            <Text
              style={[
                styles.filterText,
                filterDebt === 'ALL' && styles.activeFilterText,
              ]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              filterDebt === 'DEBT' && styles.activeFilter,
            ]}
            onPress={() => onFilterDebtChange('DEBT')}>
            <Text
              style={[
                styles.filterText,
                filterDebt === 'DEBT' && styles.activeFilterText,
              ]}>
              Deudores
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              filterDebt === 'CLEAN' && styles.activeFilter,
            ]}
            onPress={() => onFilterDebtChange('CLEAN')}>
            <Text
              style={[
                styles.filterText,
                filterDebt === 'CLEAN' && styles.activeFilterText,
              ]}>
              Al día
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 0,
  },
  filtersSection: {
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilter: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: colors.secondary,
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.secondary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 28,
  },
});

export default HomeControls;
