import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../theme/colors';
import {CuotasPorAnio} from '../types';

interface PaymentGridProps {
  cuotasPorAnio: CuotasPorAnio[];
  onTogglePayment: (anioIndex: number, monthIndex: number) => void;
}

const PaymentGrid: React.FC<PaymentGridProps> = ({
  cuotasPorAnio,
  onTogglePayment,
}) => {
  const months = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Control de Cuotas</Text>
      {cuotasPorAnio.map((anioData, anioIndex) => (
        <View key={anioData.anio} style={styles.yearContainer}>
          <Text style={styles.yearTitle}>{anioData.anio}</Text>
          <View style={styles.monthsGrid}>
            {anioData.meses.map((pagado: boolean, monthIndex: number) => (
              <TouchableOpacity
                key={monthIndex}
                style={[styles.monthBox, pagado ? styles.paid : styles.unpaid]}
                onPress={() => onTogglePayment(anioIndex, monthIndex)}>
                <Text
                  style={[
                    styles.monthText,
                    pagado ? styles.paidText : styles.unpaidText,
                  ]}>
                  {months[monthIndex]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  yearContainer: {marginBottom: 20},
  yearTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthBox: {
    width: 45,
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  paid: {
    backgroundColor: '#D1FAE5', // Emerald 100
    borderColor: colors.secondary,
  },
  unpaid: {
    backgroundColor: '#FEE2E2', // Red 100
    borderColor: colors.danger,
  },
  monthText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  paidText: {color: '#065F46'}, // Emerald 800
  unpaidText: {color: '#991B1B'}, // Red 800
});

export default PaymentGrid;
