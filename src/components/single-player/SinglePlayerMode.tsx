import React, {useState, useEffect, SetStateAction, Dispatch} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import ConfettiCannon from 'react-native-confetti-cannon';

const MyComponent = ({
  setShowConfetti,
}: {
  setShowConfetti: Dispatch<SetStateAction<boolean>>;
}) => (
  <ConfettiCannon
    count={200}
    origin={{x: -10, y: 0}}
    onAnimationEnd={() => {
      setShowConfetti(false);
    }}
  />
);

type CardTypes = {
  src: string;
  matched: boolean;
  id?: number;
  uniqueId: string;
};

const cardImages: CardTypes[] = [
  {
    id: 1,
    uniqueId: '1a',
    src: 'https://wallpapers.com/images/high/goku-pictures-b3hqvmgii144uzdq.webp',
    matched: false,
  },
  {
    id: 2,
    uniqueId: '2a',
    src: 'https://wallpapers.com/images/high/dragon-ball-z-pictures-pewvs4xft3qtu9v9.webp',
    matched: false,
  },
  {
    id: 3,
    uniqueId: '3a',
    src: 'https://wallpapers.com/images/high/goku-super-saiyan-blue-dbz-4k-3xxakmauxjjtn9lb.webp',
    matched: false,
  },
  {
    id: 4,
    uniqueId: '4a',
    src: 'https://wallpapers.com/images/high/son-goku-black-pfp-lx0d08scjyfypvlw.webp',
    matched: false,
  },
  {
    id: 5,
    uniqueId: '5a',
    src: 'https://wallpapers.com/images/high/super-saiyan-3-goku-dbz-4k-uykd80j9pklbb0tm.webp',
    matched: false,
  },
  {
    id: 6,
    uniqueId: '6a',
    src: 'https://wallpapers.com/images/high/super-saiyan-god-goku-dbz-4k-zs9ufntdm0mbct0n.webp',
    matched: false,
  },
  {
    id: 1,
    uniqueId: '1b',
    src: 'https://wallpapers.com/images/high/goku-pictures-b3hqvmgii144uzdq.webp',
    matched: false,
  },
  {
    id: 2,
    uniqueId: '2b',
    src: 'https://wallpapers.com/images/high/dragon-ball-z-pictures-pewvs4xft3qtu9v9.webp',
    matched: false,
  },
  {
    id: 3,
    uniqueId: '3b',
    src: 'https://wallpapers.com/images/high/goku-super-saiyan-blue-dbz-4k-3xxakmauxjjtn9lb.webp',
    matched: false,
  },
  {
    id: 4,
    uniqueId: '4b',
    src: 'https://wallpapers.com/images/high/son-goku-black-pfp-lx0d08scjyfypvlw.webp',
    matched: false,
  },
  {
    id: 5,
    uniqueId: '5b',
    src: 'https://wallpapers.com/images/high/super-saiyan-3-goku-dbz-4k-uykd80j9pklbb0tm.webp',
    matched: false,
  },
  {
    id: 6,
    uniqueId: '6b',
    src: 'https://wallpapers.com/images/high/super-saiyan-god-goku-dbz-4k-zs9ufntdm0mbct0n.webp',
    matched: false,
  },
];

const FlipCardGame = () => {
  const [cards, setCards] = useState<CardTypes[]>([]);
  const [firstChoice, setFirstChoice] = useState<CardTypes | null>(null);
  const [secondChoice, setSecondChoice] = useState<CardTypes | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highScore, setHighScore] = useState<number>(Infinity);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  const shuffleCards = () => {
    const shuffledCards: CardTypes[] = [...cardImages].sort(
      () => Math.random() - 0.5,
    );

    setCards(shuffledCards);
    setFirstChoice(null);
    setSecondChoice(null);
    setMoves(0);
    setShowConfetti(false);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  const handleChoice = (card: CardTypes) => {
    if (firstChoice?.uniqueId !== card.uniqueId)
      firstChoice ? setSecondChoice(card) : setFirstChoice(card);
  };

  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.id === secondChoice.id) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.src === firstChoice.src ? {...card, matched: true} : card,
          ),
        );
        resetChoices();
      } else {
        setTimeout(() => resetChoices(), 1000);
      }
    }
  }, [firstChoice, secondChoice]);
  const {height, width} = useWindowDimensions();

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card?.matched)) {
      resetChoices();
      shuffleCards();
      setShowConfetti(true);
      if (moves < highScore) {
        setIsNewHighScore(true);
      }
      setHighScore(Math.min(highScore, moves));
    }
  }, [cards]);

  const resetChoices = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setMoves(prevMoves => prevMoves + 1);
    setDisabled(false);
  };

  return (
    <View style={styles.container}>
      {showConfetti && (
        <View
          style={{
            position: 'absolute',
            zIndex: 10,
            backgroundColor: 'transparent',
            height,
            width,
          }}>
          <MyComponent setShowConfetti={setShowConfetti} />
        </View>
      )}

      {highScore !== Infinity && (
        <View style={{position: 'absolute', top: 60, right: 10}}>
          <Text style={{fontWeight: '600'}}>High Score : {highScore}</Text>
        </View>
      )}
      <Text style={styles.title}>Flip Card Game</Text>
      <Text style={styles.moves}>Moves: {moves}</Text>
      <View style={styles.cardGrid}>
        {cards.map(card => (
          <Card
            key={card.uniqueId}
            card={card}
            handleChoice={handleChoice}
            flipped={
              card === firstChoice || card === secondChoice || card.matched
            }
            disabled={disabled}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={shuffleCards}>
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>
    </View>
  );
};

interface ICard {
  card: CardTypes;
  handleChoice: (param: CardTypes) => void;
  flipped: boolean;
  disabled: boolean;
}

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
    <TouchableOpacity
      testID={'flipcard'}
      style={styles.card}
      onPress={handlePress}>
      <Animated.View testID={'test-flip'} style={[styles.cardFace, frontStyle]}>
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

export {styles};

export default FlipCardGame;
