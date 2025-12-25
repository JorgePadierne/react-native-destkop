import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {createIntegrantesApi} from '../api/integrantes';
import {createPagosApi} from '../api/pagos';
import {Integrante} from '../types';
import MemberHeader from '../components/MemberHeader';
import MemberInfoCard from '../components/MemberInfoCard';
import PaymentGrid from '../components/PaymentGrid';
import {useTheme} from '../context/ThemeContext';
import {useAxios} from '../context/AxiosContext';
import {parsePaymentsToCuotas, getMonthString} from '../utils/dateHelpers';

type MemberDetailsRouteProp = RouteProp<RootStackParamList, 'MemberDetails'>;
type MemberDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MemberDetails'
>;

const MemberDetailsScreen = () => {
  const route = useRoute<MemberDetailsRouteProp>();
  const navigation = useNavigation<MemberDetailsNavigationProp>();
  const {integranteId} = route.params;
  const {colors} = useTheme();
  const {axiosInstance, token} = useAxios();
  const integrantesApi = React.useMemo(
    () => createIntegrantesApi(axiosInstance, token),
    [axiosInstance, token],
  );
  const pagosApi = React.useMemo(
    () => createPagosApi(axiosInstance, token),
    [axiosInstance, token],
  );

  const [integrante, setIntegrante] = useState<Integrante | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const loadIntegrante = useCallback(async () => {
    setLoading(true);
    try {
      const found = await integrantesApi.getById(Number(integranteId));
      if (found) {
        setIntegrante(found);
      } else {
        Alert.alert('Error', 'Integrante no encontrado');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [integranteId, navigation, integrantesApi]);

  useEffect(() => {
    loadIntegrante();
  }, [loadIntegrante]);

  const handleSave = async (data: {
    nombre_apellidos: string;
    fecha_alta_tmp: string;
    fecha_baja_tmp: string | null;
  }) => {
    if (!integrante) {
      return;
    }
    try {
      setLoading(true);
      await integrantesApi.update(Number(integranteId), data);
      Alert.alert('Éxito', 'Datos actualizados correctamente');
      setIsEditing(false);
      await loadIntegrante(); // Reload to get fresh data
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar');
    } finally {
      setLoading(false);
    }
  };

  const handleBaja = () => {
    Alert.alert(
      'Dar de baja',
      '¿Estás seguro de que deseas dar de baja a este integrante? Se establecerá la fecha de hoy como fecha de baja.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            if (integrante) {
              try {
                setLoading(true);
                const today = new Date().toISOString().split('T')[0];
                await integrantesApi.update(Number(integranteId), {
                  fecha_baja_tmp: today,
                });
                Alert.alert('Éxito', 'Integrante dado de baja correctamente');
                await loadIntegrante(); // Reload to get fresh data
              } catch (error: any) {
                Alert.alert('Error', error.message || 'No se pudo dar de baja');
              } finally {
                setLoading(false);
              }
            }
          },
        },
      ],
    );
  };

  const handleTogglePayment = async (yearIndex: number, monthIndex: number) => {
    if (!integrante || paymentLoading) {
      return;
    }

    const cuotasPorAnio = parsePaymentsToCuotas(
      integrante.pagos,
      integrante.fecha_alta_tmp,
      integrante.fecha_baja_tmp,
    );

    const year = cuotasPorAnio[yearIndex].anio;
    const isPaid = cuotasPorAnio[yearIndex].meses[monthIndex];
    const monthStr = getMonthString(year, monthIndex);

    if (isPaid) {
      // Payment exists - show info that deletion is not supported
      Alert.alert(
        'Pago existente',
        'Este mes ya está pagado. La eliminación de pagos no está soportada actualmente.',
      );
      return;
    }

    // Create new payment
    Alert.alert(
      'Registrar Pago',
      `¿Deseas registrar el pago para ${monthStr}?`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setPaymentLoading(true);
              await pagosApi.create({
                id_persona: integrante.id_asociado,
                mes_anio_tmp: monthStr,
                monto: 10.0, // Default amount, could be configurable
              });
              Alert.alert('Éxito', 'Pago registrado correctamente');
              await loadIntegrante(); // Reload to get fresh data with new payment
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo crear el pago');
            } finally {
              setPaymentLoading(false);
            }
          },
        },
      ],
    );
  };

  if (loading && !integrante) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!integrante) {
    return null;
  }

  console.log('--- DEBUG PAYMENTS ---');
  console.log('Pagos raw:', integrante.pagos);
  if (integrante.pagos && integrante.pagos.length > 0) {
    console.log('First payment date sample:', integrante.pagos[0].mes_anio_tmp);
  }

  // Parse payments to cuotas format
  const cuotasPorAnio = parsePaymentsToCuotas(
    integrante.pagos,
    integrante.fecha_alta_tmp,
    integrante.fecha_baja_tmp,
  );

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <MemberHeader integrante={integrante} />

      <MemberInfoCard
        integrante={integrante}
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(!isEditing)}
        onSave={handleSave}
        onDelete={handleBaja}
      />

      {/* Payment grid now enabled with real data */}
      <PaymentGrid
        cuotasPorAnio={cuotasPorAnio}
        onTogglePayment={handleTogglePayment}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default MemberDetailsScreen;
