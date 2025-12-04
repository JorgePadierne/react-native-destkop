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
import {calculateDebtStatus} from '../utils/finance';
import {useTheme} from '../context/ThemeContext';

type HomeTableNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeTableProps {
  integrantes: Integrante[];
  loading: boolean;
}

const HomeTable: React.FC<HomeTableProps> = ({integrantes, loading}) => {
  const navigation = useNavigation<HomeTableNavigationProp>();
  const {colors} = useTheme();

  const renderItem = ({item}: {item: Integrante}) => {
    const status = calculateDebtStatus(item);
    const isDebt = status === 'DEUDA';

    return (
      <View
        style={[
          styles.rowContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.cardShadow,
          },
        ]}>
        {/* Status Indicator */}
        <View style={styles.statusCell}>
          <View
            style={[
              styles.statusDot,
              isDebt ? styles.statusDotDebt : styles.statusDotClean,
              {borderColor: isDebt ? colors.danger : colors.secondary},
            ]}
          />
        </View>

        {/* Name */}
        <View style={styles.nameCell}>
          <Text style={[styles.nameText, {color: colors.text}]}>
            {item.nombre}
          </Text>
          {item.baja && <Text style={styles.bajaTag}>BAJA</Text>}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: colors.primary}]}
          onPress={() =>
            navigation.navigate('MemberDetails', {integranteId: item.id})
          }>
          <Text style={styles.actionButtonText}>Ver</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.headerRow, {borderBottomColor: colors.border}]}>
        <Text style={[styles.headerText, {color: colors.textLight}]}>
          ESTADO
        </Text>
        <Text
          style={[
            styles.headerText,
            styles.nameHeader,
            {color: colors.textLight},
          ]}>
          NOMBRE
        </Text>
        <Text style={[styles.headerText, {color: colors.textLight}]}>
          ACCIÓN
        </Text>
      </View>

      <FlatList
        data={integrantes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 60,
  },
  nameHeader: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusCell: {
    width: 60,
    justifyContent: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  statusDotClean: {
    backgroundColor: 'transparent',
  },
  statusDotDebt: {
    backgroundColor: 'transparent',
  },
  nameCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bajaTag: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: 'bold',
    marginLeft: 8,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default HomeTable;
