import {View, StyleSheet} from 'react-native';
import HomeHeader from '../components/HomeHeader';
import {useAuth} from '../context/AuthContext';
import HomeTable from '../components/HomeTable';

const HomeScreen: React.FC = () => {
  const {logout} = useAuth();
  return (
    <View style={styles.container}>
      <HomeHeader logout={logout} />
      <HomeTable />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#F3F6FF'},

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D72638',
  },

  filtersContainer: {
    marginTop: 16,
    marginBottom: 4,
  },
});
