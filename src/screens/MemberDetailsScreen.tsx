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
import {Integrante} from '../types';
import MemberHeader from '../components/MemberHeader';
import MemberInfoCard from '../components/MemberInfoCard';
import {useTheme} from '../context/ThemeContext';
import {useAxios} from '../context/AxiosContext';
import {useAuth} from '../context/AuthContext';

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
  const {axiosInstance} = useAxios();
  const {token} = useAuth();
  const integrantesApi = React.useMemo(
    () => createIntegrantesApi(axiosInstance, token),
    [axiosInstance, token],
  );

  const [integrante, setIntegrante] = useState<Integrante | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSave = async (_data: {
    nombre_apellidos: string;
    fecha_alta_tmp: string;
    fecha_baja_tmp: string | null;
  }) => {
    if (!integrante) {
      return;
    }
    try {
      setLoading(true);
      // For now, we reload after save since update endpoint might not exist
      // You may need to implement PUT /asociated/update/{id} in your backend
      Alert.alert(
        'Información',
        'La funcionalidad de edición requiere un endpoint de actualización en el backend',
      );
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar');
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
                // This requires an update endpoint in the backend
                Alert.alert(
                  'Información',
                  'La funcionalidad de dar de baja requiere un endpoint de actualización',
                );
              } catch (e) {
                Alert.alert('Error', 'No se pudo dar de baja');
              }
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

      {/* Payment grid temporarily disabled - requires implementation with POST /payments/create */}
      {/* <PaymentGrid
        cuotasPorAnio={integrante.cuotasPorAnio}
        onTogglePayment={togglePayment}
      />  */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default MemberDetailsScreen;
