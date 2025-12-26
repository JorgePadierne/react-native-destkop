import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useAxios} from '../context/AxiosContext';
import {createPagosApi} from '../api/pagos';

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const AccountingScreen: React.FC = () => {
  const {colors} = useTheme();
  const {axiosInstance, token} = useAxios();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState<{[key: number]: number}>({});
  const [yearlyTotal, setYearlyTotal] = useState(0);

  const pagosApi = useMemo(
    () => createPagosApi(axiosInstance, token),
    [axiosInstance, token],
  );

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      // Fetch yearly total
      const yearRes = await pagosApi.getAccountingTotal(selectedYear);
      setYearlyTotal(yearRes.total);

      // Fetch each month total
      const monthPromises = Array.from({length: 12}, (_, i) =>
        pagosApi.getAccountingTotal(selectedYear, i + 1),
      );

      const monthResults = await Promise.all(monthPromises);
      const newTotals: {[key: number]: number} = {};
      monthResults.forEach((res, index) => {
        newTotals[index + 1] = res.total;
      });
      setTotals(newTotals);
    } catch (error) {
      console.error('Error fetching accounting data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, pagosApi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePrevYear = () => setSelectedYear(prev => prev - 1);
  const handleNextYear = () => setSelectedYear(prev => prev + 1);

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.header, {backgroundColor: colors.primary}]}>
        <TouchableOpacity onPress={handlePrevYear} style={styles.yearButton}>
          <Text style={styles.yearButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.yearText}>{selectedYear}</Text>
        <TouchableOpacity onPress={handleNextYear} style={styles.yearButton}>
          <Text style={styles.yearButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.totalCard,
            {backgroundColor: colors.surface, borderColor: colors.border},
          ]}>
          <Text style={[styles.totalLabel, {color: colors.textLight}]}>
            Total Recaudado en {selectedYear}
          </Text>
          <Text style={[styles.totalValue, {color: colors.primary}]}>
            {yearlyTotal.toFixed(2).replace('.', ',')} €
          </Text>
        </View>

        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          Desglose Mensual
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        ) : (
          <View style={styles.monthsGrid}>
            {MONTHS.map((month, index) => (
              <View
                key={month}
                style={[
                  styles.monthCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: totals[index + 1] > 0 ? 1 : 0.6,
                  },
                ]}>
                <Text style={[styles.monthName, {color: colors.text}]}>
                  {month}
                </Text>
                <Text
                  style={[
                    styles.monthValue,
                    {
                      color:
                        totals[index + 1] > 0
                          ? colors.secondary
                          : colors.textLight,
                    },
                  ]}>
                  {(totals[index + 1] || 0).toFixed(2).replace('.', ',')} €
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  yearButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    width: 40,
    alignItems: 'center',
  },
  yearButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  yearText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 30,
  },
  content: {
    padding: 20,
  },
  totalCard: {
    padding: 25,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  monthName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  monthValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AccountingScreen;
