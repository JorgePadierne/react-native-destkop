import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Text,
  TouchableOpacity,
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
import {useAuth} from '../context/AuthContext';
import {
  parsePaymentsToCuotas,
  getMonthString,
  formatDateToYYYYMM,
} from '../utils/dateHelpers';

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
  const {user} = useAuth();

  const isReadOnly = user?.role === 'USER';
  const canDeletePayments = user?.role !== 'USER';

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

      // Fix: Validation for YYYY-MM format to convert to YYYY-MM-DD
      let sanitizedFechaAlta = data.fecha_alta_tmp;
      if (/^\d{4}-\d{2}$/.test(sanitizedFechaAlta)) {
        sanitizedFechaAlta = `${sanitizedFechaAlta}-01`;
      }

      await integrantesApi.update(Number(integranteId), {
        ...data,
        fecha_alta_tmp: sanitizedFechaAlta,
      });
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
                  activo: false,
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

  const handlePermanentDelete = () => {
    Alert.alert(
      'ELIMINAR PERMANENTEMENTE',
      '¿Estás ABSOLUTAMENTE SEGURO? Esta acción no se puede deshacer y borrará todos los datos del integrante y sus pagos.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'SÍ, ELIMINAR',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await integrantesApi.deleteById(Number(integranteId));
              Alert.alert('Éxito', 'Integrante eliminado permanentemente');
              navigation.navigate('Home');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo eliminar');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleAlta = () => {
    Alert.alert(
      'Dar de Alta',
      '¿Estás seguro de que deseas reactivar a este integrante?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Confirmar',
          onPress: async () => {
            if (integrante) {
              try {
                setLoading(true);
                await integrantesApi.update(Number(integranteId), {
                  fecha_baja_tmp: null,
                  activo: true,
                });
                Alert.alert('Éxito', 'Integrante reactivado correctamente');
                await loadIntegrante(); // Reload to get fresh data
              } catch (error: any) {
                Alert.alert('Error', error.message || 'No se pudo reactivar');
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
    const monthData = cuotasPorAnio[yearIndex].meses[monthIndex];
    const isPaid = monthData.paid;
    const monthStr = getMonthString(year, monthIndex);

    // RBAC Check
    if (isReadOnly) {
      Alert.alert('Acceso Denegado', 'No tienes permisos.');
      return;
    }

    if (isPaid) {
      if (!canDeletePayments) {
        Alert.alert('Acceso Denegado', 'No tienes permisos.');
        return;
      }

      // Try to find payment ID from the grid data first, fallback to array search
      let paymentIdToDelete = monthData.id;

      if (!paymentIdToDelete && integrante.pagos) {
        const paymentToDelete = integrante.pagos.find(
          p => formatDateToYYYYMM(p.mes_anio_tmp) === monthStr,
        );
        paymentIdToDelete = paymentToDelete ? paymentToDelete.id : null;
      }

      if (!paymentIdToDelete) {
        Alert.alert('Error', 'No se encontró el pago para eliminar');
        return;
      }

      // Confirm deletion
      Alert.alert(
        'Eliminar Pago',
        `¿Deseas eliminar el pago del mes ${monthStr}?`,
        [
          {text: 'Cancelar', style: 'cancel'},
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              try {
                setPaymentLoading(true);
                await pagosApi.remove(paymentIdToDelete as number);
                Alert.alert('Éxito', 'Pago eliminado correctamente');
                await loadIntegrante(); // Reload data
              } catch (error: any) {
                Alert.alert(
                  'Error',
                  error.message || 'No se pudo eliminar el pago',
                );
              } finally {
                setPaymentLoading(false);
              }
            },
          },
        ],
      );
      return;
    }

    // Create new payment
    Alert.alert('Registrar Pago', `Selecciona el monto para ${monthStr}:`, [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: '3 Euros',
        onPress: () => registerPayment(monthStr, 3.0),
      },
      {
        text: '5 Euros',
        onPress: () => registerPayment(monthStr, 5.0),
      },
    ]);
  };

  const registerPayment = async (monthStr: string, amount: number) => {
    if (!integrante) {
      return;
    }
    try {
      setPaymentLoading(true);
      await pagosApi.create({
        id_persona: integrante.id_asociado,
        mes_anio_tmp: monthStr,
        monto: amount,
      });
      Alert.alert('Éxito', 'Pago registrado correctamente');
      await loadIntegrante(); // Reload to get fresh data with new payment
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear el pago');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleFillAllPayments = () => {
    if (
      !integrante ||
      !integrante.mesesMorosos ||
      integrante.mesesMorosos.length === 0
    ) {
      Alert.alert('Información', 'No hay meses pendientes de pago.');
      return;
    }

    Alert.alert(
      'Rellenar Pagos',
      `¿Deseas registrar ${integrante.mesesMorosos.length} pagos pendientes? Selecciona el monto:`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: '3 Euros',
          onPress: () => processBulkPayments(3.0),
        },
        {
          text: '5 Euros',
          onPress: () => processBulkPayments(5.0),
        },
      ],
    );
  };

  const processBulkPayments = async (amount: number) => {
    if (!integrante || !integrante.mesesMorosos) {
      return;
    }

    try {
      setPaymentLoading(true);
      for (const monthStr of integrante.mesesMorosos) {
        try {
          await pagosApi.create({
            id_persona: integrante.id_asociado,
            mes_anio_tmp: monthStr,
            monto: amount,
          });
        } catch (err) {
          console.error(`Error filling month ${monthStr}:`, err);
        }
      }
      Alert.alert('Éxito', 'Pagos registrados correctamente');
      await loadIntegrante();
    } catch (error: any) {
      Alert.alert('Error', 'Ocurrió un error al procesar los pagos.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDeleteAllPayments = () => {
    if (!integrante || !integrante.pagos || integrante.pagos.length === 0) {
      Alert.alert('Información', 'No hay pagos registrados para eliminar.');
      return;
    }

    Alert.alert(
      'Borrar TODOS los Pagos',
      `¿Estás seguro de que deseas eliminar los ${integrante.pagos.length} pagos registrados? Esta acción no se puede deshacer.`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'ELIMINAR TODO',
          style: 'destructive',
          onPress: async () => {
            try {
              setPaymentLoading(true);
              // Reverse to avoid issues if order matters, though usually it doesn't for deletes
              for (const pago of integrante.pagos) {
                try {
                  await pagosApi.remove(pago.id);
                } catch (err) {
                  console.error(`Error deleting payment ${pago.id}:`, err);
                }
              }
              Alert.alert('Éxito', 'Todos los pagos han sido eliminados');
              await loadIntegrante();
            } catch (error: any) {
              Alert.alert('Error', 'Ocurrió un error al eliminar los pagos.');
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

  // Calculate total money contributed
  const totalAportado =
    integrante.pagos?.reduce((sum, p) => sum + Number(p.monto), 0) || 0;

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <ScrollView style={styles.leftColumn}>
        <MemberHeader integrante={integrante} totalAportado={totalAportado} />

        <MemberInfoCard
          integrante={integrante}
          isEditing={isEditing}
          onEditToggle={() => setIsEditing(!isEditing)}
          onSave={handleSave}
          onDelete={handleBaja}
          onPermanentDelete={handlePermanentDelete}
          onActivate={handleAlta}
          isReadOnly={isReadOnly}
        />

        {!isReadOnly && (
          <View style={styles.bulkActions}>
            <TouchableOpacity
              style={[styles.bulkButton, {backgroundColor: colors.primary}]}
              onPress={handleFillAllPayments}>
              <Text style={styles.bulkButtonText}>
                Rellenar Pagos Pendientes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bulkButton, {backgroundColor: colors.danger}]}
              onPress={handleDeleteAllPayments}>
              <Text style={styles.bulkButtonText}>
                Eliminar Todos los Pagos
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <ScrollView style={styles.rightColumn}>
        <PaymentGrid
          cuotasPorAnio={cuotasPorAnio}
          onTogglePayment={handleTogglePayment}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  leftColumn: {
    flex: 1,
    marginRight: 10,
  },
  rightColumn: {
    flex: 1,
    marginLeft: 10,
  },
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bulkButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default MemberDetailsScreen;
