import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';

const cardImages = [
  {src: 'https://picsum.photos/100/100?random=1', matched: false},
  {src: 'https://picsum.photos/100/100?random=2', matched: false},
  {src: 'https://picsum.photos/100/100?random=3', matched: false},
  {src: 'https://picsum.photos/100/100?random=4', matched: false},
  {src: 'https://picsum.photos/100/100?random=5', matched: false},
  {src: 'https://picsum.photos/100/100?random=6', matched: false},
];

const MultiplayerFlipCardGame = ({playerId, gameId}) => {
  const [gameData, setGameData] = useState(null);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [allMatched, setAllMatched] = useState(false);

  useEffect(() => {
    const gameRef = firestore().collection('games').doc(gameId);
    const unsubscribe = gameRef.onSnapshot(doc => {
      if (doc.exists) {
        setGameData(doc.data());
      }
    });
    return () => unsubscribe();
  }, [gameId]);

  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.src === secondChoice.src) {
        updateMatchedCards(firstChoice.src);
        resetChoices();
      } else {
        setTimeout(() => resetChoices(), 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  useEffect(() => {
    if (gameData && gameData.cards.every(card => card.matched)) {
      setAllMatched(true);
    }
  }, [gameData]);

  const handleChoice = card => {
    if (!disabled && gameData.turn === playerId) {
      firstChoice ? setSecondChoice(card) : setFirstChoice(card);
    }
  };

  const resetChoices = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
    switchTurn();
  };

  const switchTurn = async () => {
    const nextTurn =
      gameData.turn === gameData.players[0].id
        ? gameData.players[1].id
        : gameData.players[0].id;
    await firestore().collection('games').doc(gameId).update({turn: nextTurn});
  };

  const updateMatchedCards = async src => {
    const updatedCards = gameData.cards.map(card =>
      card.src === src ? {...card, matched: true} : card,
    );
    await firestore()
      .collection('games')
      .doc(gameId)
      .update({cards: updatedCards});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multiplayer Flip Card Game</Text>
      <Text style={styles.turn}>
        Current Turn:{' '}
        {gameData?.players.find(p => p.id === gameData.turn)?.name}
      </Text>
      <View style={styles.cardGrid}>
        {gameData?.cards.map(card => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={
              card === firstChoice || card === secondChoice || card.matched
            }
          />
        ))}
      </View>
      {allMatched && <ConfettiCannon count={100} origin={{x: -10, y: 0}} />}
    </View>
  );
};

const Card = ({card, handleChoice, flipped}) => {
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

  return (
    <TouchableOpacity style={styles.card} onPress={() => handleChoice(card)}>
      <Animated.View style={[styles.cardFace, frontStyle]}>
        <Image source={{uri: card.src}} style={styles.image} />
      </Animated.View>
      <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
        <Image
          source={{uri: 'https://picsum.photos/100/100?random=7'}}
          style={styles.image}
        />
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  turn: {
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
    perspective: 1000,
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 10,
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
});

export default MultiplayerFlipCardGame;
