import {useState} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import AnimatedPressable from './AnimatedPressable';
interface HomeHeaderProps {
  logout: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({logout}) => {
  const [search, setSearch] = useState('');

  return (
    <View style={styles.headerRow}>
      <View style={styles.headerActions}>
        <View style={styles.headerFlex}>
          <TextInput
            placeholder="Buscar por nombre"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#666"
            style={styles.searchInput}
          />
          <AnimatedPressable style={styles.addButton}>
            <Text style={styles.addText}>➕</Text>
          </AnimatedPressable>
        </View>
        <AnimatedPressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerActions: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerFlex: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  searchInput: {
    width: '90%',
    borderColor: '#0052A5',
    backgroundColor: '#ffffffff',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: '#000000ff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logoutText: {color: '#0052A5', fontSize: 12, fontWeight: '600'},

  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#0052A5',
  },
  addButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderColor: '#0052A5',
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  addText: {color: '#FFFFFF', fontSize: 12, fontWeight: '600'},
});

export default HomeHeader;
