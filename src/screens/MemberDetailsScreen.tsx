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
import {getIntegrantes, updateIntegrante} from '../api/integrantes';
import {Integrante} from '../types';
import MemberHeader from '../components/MemberHeader';
import MemberInfoCard from '../components/MemberInfoCard';
import PaymentGrid from '../components/PaymentGrid';
import {useTheme} from '../context/ThemeContext';

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

  const [integrante, setIntegrante] = useState<Integrante | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const loadIntegrante = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getIntegrantes();
      const found = all.find(i => i.id === integranteId);
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
  }, [integranteId, navigation]);

  useEffect(() => {
    loadIntegrante();
  }, [loadIntegrante]);

  const handleSave = async (data: {
    nombre: string;
    alta: string;
    baja: string | null;
  }) => {
    if (!integrante) {
      return;
    }
    try {
      setLoading(true);
      const updated = await updateIntegrante(integrante.id, data);
      setIntegrante(updated);
      setIsEditing(false);
      Alert.alert('Éxito', 'Datos actualizados correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar');
    } finally {
      setLoading(false);
    }
  };

  const togglePayment = async (anioIndex: number, monthIndex: number) => {
    if (!integrante) {
      return;
    }

    // Deep copy to avoid direct mutation issues
    const newCuotas = JSON.parse(JSON.stringify(integrante.cuotasPorAnio));
    newCuotas[anioIndex].meses[monthIndex] =
      !newCuotas[anioIndex].meses[monthIndex];

    try {
      // Optimistic update locally
      const updated = {...integrante, cuotasPorAnio: newCuotas};
      setIntegrante(updated);

      // Persist
      await updateIntegrante(integrante.id, {cuotasPorAnio: newCuotas});
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el pago');
      loadIntegrante(); // Revert on error
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
            const today = new Date().toISOString().split('T')[0];
            if (integrante) {
              try {
                const updated = await updateIntegrante(integrante.id, {
                  baja: today,
                });
                setIntegrante(updated);
                Alert.alert(
                  'Información',
                  'El integrante ha sido dado de baja.',
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

      <PaymentGrid
        cuotasPorAnio={integrante.cuotasPorAnio}
        onTogglePayment={togglePayment}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default MemberDetailsScreen;
