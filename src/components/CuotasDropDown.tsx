// /src/components/CuotasDropDown.tsx
import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  FlatList,
} from 'react-native';
import {CuotasPorAnio} from '../types';

interface CuotasDropdownProps {
  cuotasPorAnio?: CuotasPorAnio[];
  onGuardar?: (anio: number, meses: boolean[]) => void;
}

const nombresMeses = [
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

const CuotasDropDown: React.FC<CuotasDropdownProps> = ({
  cuotasPorAnio,
  onGuardar,
}) => {
  const [abierto, setAbierto] = useState(false);
  const anioActual = new Date().getFullYear();
  const aniosDisponibles = useMemo(() => {
    const base = 2024;
    const max = Math.max(anioActual, base);
    const lista: number[] = [];
    for (let a = base; a <= max; a++) {
      lista.push(a);
    }
    return lista;
  }, [anioActual]);

  const [anioSeleccionado, setAnioSeleccionado] = useState<number>(
    cuotasPorAnio && cuotasPorAnio.length > 0
      ? cuotasPorAnio[0].anio
      : Math.max(2024, anioActual),
  );

  const obtenerMesesIniciales = (anio: number): boolean[] => {
    const registro = cuotasPorAnio?.find(c => c.anio === anio);
    return registro ? registro.meses : Array(12).fill(false);
  };

  const [meses, setMeses] = useState<boolean[]>(
    obtenerMesesIniciales(
      cuotasPorAnio && cuotasPorAnio.length > 0
        ? cuotasPorAnio[0].anio
        : Math.max(2024, anioActual),
    ),
  );

  const toggleMes = (index: number) => {
    const newMeses = [...meses];
    newMeses[index] = !newMeses[index];
    setMeses(newMeses);
  };

  const handleGuardar = () => {
    onGuardar && onGuardar(anioSeleccionado, meses);
    setAbierto(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setAbierto(!abierto)}
        style={styles.boton}>
        <Text style={styles.botonTexto}>Cuotas ▾</Text>
      </TouchableOpacity>

      {abierto && (
        <View style={styles.dropdown}>
          <View style={styles.anioRow}>
            <Text style={styles.anioLabel}>Año:</Text>
            <FlatList
              data={aniosDisponibles}
              horizontal
              keyExtractor={item => item.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    setAnioSeleccionado(item);
                    setMeses(obtenerMesesIniciales(item));
                  }}
                  style={[
                    styles.chip,
                    item === anioSeleccionado && styles.chipActivo,
                  ]}>
                  <Text
                    style={[
                      styles.chipTexto,
                      item === anioSeleccionado && styles.chipTextoActivo,
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <FlatList
            data={nombresMeses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => toggleMes(index)}
                style={styles.mesItem}>
                <Text
                  style={[
                    styles.mesTexto,
                    meses[index] && styles.mesTextoActivo,
                  ]}>
                  {meses[index] ? '☑' : '☐'} {item}
                </Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Guardar" onPress={handleGuardar} color="#00853E" />
        </View>
      )}
    </View>
  );
};

export default CuotasDropDown;

const styles = StyleSheet.create({
  container: {marginVertical: 5},
  boton: {backgroundColor: '#00853E', padding: 8, borderRadius: 5},
  botonTexto: {color: '#fff', fontWeight: 'bold', textAlign: 'center'},
  dropdown: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  anioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  anioLabel: {marginRight: 6, fontWeight: '600', color: '#0052A5'},
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0052A5',
    marginRight: 6,
  },
  chipActivo: {backgroundColor: '#0052A5'},
  chipTexto: {fontSize: 12, color: '#0052A5'},
  chipTextoActivo: {color: '#FFFFFF', fontWeight: '600'},
  mesItem: {paddingVertical: 4},
  mesTexto: {fontSize: 16, color: '#333'},
  mesTextoActivo: {color: '#00853E', fontWeight: '600'},
});
