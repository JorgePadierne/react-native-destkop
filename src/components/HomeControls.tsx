import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {ThemeColors} from '../theme/colors';

interface HomeControlsProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onAddMember: () => void;
  filterStatus: 'ALL' | 'ACTIVE' | 'INACTIVE';
  onFilterStatusChange: (status: 'ALL' | 'ACTIVE' | 'INACTIVE') => void;
  filterDebt: 'ALL' | 'DEBT' | 'CLEAN';
  onFilterDebtChange: (status: 'ALL' | 'DEBT' | 'CLEAN') => void;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const HomeControls: React.FC<HomeControlsProps> = ({
  searchQuery,
  onSearchChange,
  onAddMember,
  filterStatus,
  onFilterStatusChange,
  filterDebt,
  onFilterDebtChange,
  colors,
  toggleTheme,
  isDarkMode,
}) => {
  return (
    <View
      style={[
        styles.controlsContainer,
        {backgroundColor: colors.surface, shadowColor: colors.cardShadow},
      ]}>
      <View style={styles.topRow}>
        <View style={styles.searchRow}>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Buscar por nombre..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          <TouchableOpacity
            style={[styles.addButton, {backgroundColor: colors.secondary}]}
            onPress={onAddMember}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.themeButton, {backgroundColor: colors.inputBg}]}
          onPress={toggleTheme}>
          <Text style={{fontSize: 20}}>{isDarkMode ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersSection}>
        <Text style={[styles.filterLabel, {color: colors.textLight}]}>
          Estado
        </Text>
        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {backgroundColor: colors.inputBg, borderColor: colors.border},
              filterStatus === 'ALL' && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => onFilterStatusChange('ALL')}>
            <Text
              style={[
                styles.filterText,
                {color: colors.textLight},
                filterStatus === 'ALL' && styles.activeFilterText,
              ]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {backgroundColor: colors.inputBg, borderColor: colors.border},
              filterStatus === 'ACTIVE' && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => onFilterStatusChange('ACTIVE')}>
            <Text
              style={[
                styles.filterText,
                {color: colors.textLight},
                filterStatus === 'ACTIVE' && styles.activeFilterText,
              ]}>
              Activos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {backgroundColor: colors.inputBg, borderColor: colors.border},
              filterStatus === 'INACTIVE' && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => onFilterStatusChange('INACTIVE')}>
            <Text
              style={[
                styles.filterText,
                {color: colors.textLight},
                filterStatus === 'INACTIVE' && styles.activeFilterText,
              ]}>
              Inactivos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filtersSection}>
        <Text style={[styles.filterLabel, {color: colors.textLight}]}>
          Pagos
        </Text>
        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {backgroundColor: colors.inputBg, borderColor: colors.border},
              filterDebt === 'ALL' && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => onFilterDebtChange('ALL')}>
            <Text
              style={[
                styles.filterText,
                {color: colors.textLight},
                filterDebt === 'ALL' && styles.activeFilterText,
              ]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {backgroundColor: colors.inputBg, borderColor: colors.border},
              filterDebt === 'DEBT' && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => onFilterDebtChange('DEBT')}>
            <Text
              style={[
                styles.filterText,
                {color: colors.textLight},
                filterDebt === 'DEBT' && styles.activeFilterText,
              ]}>
              Deudores
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {backgroundColor: colors.inputBg, borderColor: colors.border},
              filterDebt === 'CLEAN' && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => onFilterDebtChange('CLEAN')}>
            <Text
              style={[
                styles.filterText,
                {color: colors.textLight},
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
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  searchRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
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
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  themeButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
});

export default HomeControls;
