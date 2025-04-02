import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MultiplayerMode from 'components/multi-player/Multiplayer';
import OfflineMultiplayerMode from 'components/offline-multiplayer-mode/OfflineMultiplayerMode';
import FlipCardGame from 'components/single-player/SinglePlayerMode';
import Home from 'screens/Home/HomeScreen';
import {RootStackParamList} from 'src/types/navigation-types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="MultiPlayer" component={MultiplayerMode} />
      <Stack.Screen name="Solo" component={FlipCardGame} />
    </Stack.Navigator>
  );
}

export default RootScreen;
