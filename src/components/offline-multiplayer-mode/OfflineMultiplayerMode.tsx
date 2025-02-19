import React, {useState, useEffect, SetStateAction, Dispatch} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
} from 'react-native';

import ConfettiCannon from 'react-native-confetti-cannon';
import {CardTypes} from '../../types/Generic';
import Card from '../card/Card';

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

const OfflineMultiplayerMode = () => {
  const [cards, setCards] = useState<CardTypes[]>([]);
  const [firstChoice, setFirstChoice] = useState<CardTypes | null>(null);
  const [secondChoice, setSecondChoice] = useState<CardTypes | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highScore, setHighScore] = useState<number>(Infinity);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [playersDetails, setPlayersDetails] = useState([
    {id: 23, name: 'Vijay', moves: 0, current: true, score: 0},
    {id: 17, name: 'Kakarot', moves: 0, current: false, score: 0},
  ]);

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
        setTimeout(() => {
          trackScore(true);
        }, 300);
      } else {
        setTimeout(() => {
          trackScore(false);
          resetChoices();
        }, 1000);
      }
    }
  }, [firstChoice, secondChoice]);
  const {height, width} = useWindowDimensions();

  const getWinners = (
    players: {
      id: number;
      name: string;
      moves: number;
      current: boolean;
      score: number;
    }[],
  ) => {
    if (players.length === 0) return []; // Handle empty array case

    const maxScore = Math.max(...players.map(player => player.score));

    const winners = players.filter(player => player.score === maxScore);

    return winners.length === 1 ? winners[0] : winners; // Return single object if one winner, array if multiple
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card?.matched)) {
      resetChoices();
      shuffleCards();

      const data = getWinners(playersDetails);
      if (Array.isArray(data)) {
        const name = data.map(data => data.name).join(', ');
        Alert.alert(`${name} won the match`, `Score : ${data[0].score}`);
      } else Alert.alert(`${data.name} won the match`, `Score : ${data.score}`);

      setHighScore(Math.min(highScore, moves));
    }
  }, [cards, playersDetails]);

  const resetChoices = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setMoves(prevMoves => prevMoves + 1);
    setDisabled(false);
  };

  const trackScore = (isMatched: boolean) => {
    setPlayersDetails(prev => {
      const temp = [...prev];
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].current) {
          if (i === temp.length - 1) {
            temp[0].current = true;
          } else {
            temp[i + 1].current = true;
          }
          if (isMatched) {
            temp[i].score++;
          }
          temp[i].current = false;
          temp[i].moves++;
          break;
        }
      }
      return temp;
    });
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
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          height: 100,
          width: '100%',
          marginTop: 20,
          paddingHorizontal: 30,
        }}>
        {playersDetails.map(data => {
          return (
            <View
              key={data.id.toString()}
              style={{
                width: 100,
                height: 120,
                backgroundColor: data.current ? '#0F0' : '#F0F',
              }}>
              <View
                style={{
                  backgroundColor: '#FFF',
                  height: 60,
                  width: '80%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 5,
                }}>
                <Text>{data.name}</Text>
              </View>

              <View style={{alignItems: 'center', marginTop: 5}}>
                <Text style={{color: '#333', fontWeight: '600'}}>
                  Moves: {data.moves}
                </Text>
                <Text style={{color: '#333', fontWeight: '600'}}>
                  Score: {data.score}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
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

export default OfflineMultiplayerMode;
