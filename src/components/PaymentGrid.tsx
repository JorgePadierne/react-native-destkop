import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {CuotasPorAnio} from '../types';
import {useTheme} from '../context/ThemeContext';

interface PaymentGridProps {
  cuotasPorAnio: CuotasPorAnio[];
  onTogglePayment: (anioIndex: number, monthIndex: number) => void;
}

const PaymentGrid: React.FC<PaymentGridProps> = ({
  cuotasPorAnio,
  onTogglePayment,
}) => {
  const {colors} = useTheme();
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
    <View
      style={[
        styles.card,
        {backgroundColor: colors.surface, shadowColor: colors.cardShadow},
      ]}>
      <Text style={[styles.sectionTitle, {color: colors.text}]}>
        Control de Cuotas
      </Text>
      {cuotasPorAnio.map((anioData, anioIndex) => (
        <View key={anioData.anio} style={styles.yearContainer}>
          <Text style={[styles.yearTitle, {color: colors.text}]}>
            {anioData.anio}
          </Text>
          <View style={styles.monthsGrid}>
            {anioData.meses.map((mesData, monthIndex) => (
              <TouchableOpacity
                key={monthIndex}
                style={[
                  styles.monthBox,
                  mesData.paid
                    ? {backgroundColor: colors.secondary}
                    : {backgroundColor: colors.inputBg},
                ]}
                onPress={() => onTogglePayment(anioIndex, monthIndex)}>
                <Text
                  style={[
                    styles.monthText,
                    mesData.paid
                      ? {color: '#fff', fontWeight: 'bold'}
                      : {color: colors.textLight},
                  ]}>
                  {months[monthIndex]}
                </Text>
                {mesData.paid && mesData.amount && (
                  <Text style={[styles.amountText, {color: '#fff'}]}>
                    {Number(mesData.amount)}€
                  </Text>
                )}
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
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 16,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  yearContainer: {
    marginBottom: 20,
  },
  yearTitle: {
    fontSize: 16,
    fontWeight: '600',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 10,
  },
  amountText: {
    fontSize: 9,
    marginTop: 2,
    fontWeight: 'bold',
  },
});

export default PaymentGrid;
