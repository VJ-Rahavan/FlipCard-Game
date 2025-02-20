import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {HomeScreenNavigationProp} from 'src/types/navigation-types';

const Home = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('MultiPlayer');
        }}
        style={styles.btn}>
        <Text>Multiplayer Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Solo');
        }}
        style={styles.btn}>
        <Text>Single player Mode</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#00ff00',
    width: 200,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default Home;
