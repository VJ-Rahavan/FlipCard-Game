import React, {useEffect} from 'react';
import {Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {ICard} from '../../types/Generic';

const Card = ({card, handleChoice, flipped, disabled}: ICard) => {
  const flipAnimation = useSharedValue(0);

  useEffect(() => {
    flipAnimation.value = withTiming(flipped ? 1 : 0, {duration: 300});
  }, [flipped]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{rotateY: `${180 * flipAnimation.value}deg`}],
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{rotateY: `${180 * (1 - flipAnimation.value)}deg`}],
  }));

  const handlePress = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Animated.View style={[styles.cardFace, frontStyle]}>
        <Text>Hello</Text>
      </Animated.View>
      <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
        <Image source={{uri: card.src}} style={styles.image} />
        {/* <Image source={require('./images/back.png')} style={styles.image} /> */}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    position: 'relative',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  moves: {
    fontSize: 18,
    marginBottom: 10,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 100,
    height: 100,
    margin: 5,
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBack: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Card;
