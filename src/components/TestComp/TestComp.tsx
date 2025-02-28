import {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

const TestComp = () => {
  const [show, setShow] = useState(false);
  const [increment, setIncrement] = useState(0);

  return (
    <View>
      <TouchableOpacity
        testID="press-button" // ✅ Added for testing
        onPress={() => {
          setShow(true);
        }}
      />
      <View>
        <Text>{show ? 'Helo' : 'Hi'}</Text>
      </View>
    </View>
  );
};

export default TestComp;
