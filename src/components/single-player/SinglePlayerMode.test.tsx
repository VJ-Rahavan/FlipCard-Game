import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react-native';
import FlipCardGame, {styles} from './SinglePlayerMode';

jest.mock('react-native-confetti-cannon', () => 'ConfettiCannon');

describe('FlipCardGame', () => {
  it('renders correctly', () => {
    const {getByText} = render(<FlipCardGame />);
    expect(getByText('Flip Card Game')).toBeTruthy();
    expect(getByText('Moves: 0')).toBeTruthy();
  });

  it('flips a card on press', async () => {
    const {getAllByText} = render(<FlipCardGame />);
    const cards = getAllByText('Hello');

    fireEvent.press(cards[0]);
    await waitFor(() => {
      expect(cards[0]).toBeTruthy();
    });
  });

  it('matches two identical cards', async () => {
    const {getAllByText, getAllByTestId} = render(<FlipCardGame />);
    const btn = getAllByTestId('flipcard');
    const cards = getAllByTestId('test-flip');

    console.log(cards[0].props.style.transform);

    jest.useFakeTimers();

    await act(async () => {
      fireEvent.press(btn[0]);
      jest.runAllTimers(); // Fast-forward all pending timers
    });

    await waitFor(
      () => {
        expect(cards[0].props.style).toBeDefined();
        expect(cards[0].props.style.transform).toContainEqual([
          {rotateY: '180deg'},
        ]);
      },
      {timeout: 3000},
    );

    console.log(cards[0].props.style.transform);
  });

  it('does not match two different cards', async () => {
    const {getAllByText} = render(<FlipCardGame />);
    const cards = getAllByText('Hello');

    fireEvent.press(cards[0]);
    fireEvent.press(cards[1]);

    await waitFor(() => {
      expect(cards[0].props.style).not.toContainEqual(
        expect.objectContaining({transform: [{rotateY: '180deg'}]}),
      );
    });
  });

  it('displays confetti when all cards are matched', async () => {
    const {getAllByText, getByTestId} = render(<FlipCardGame />);
    const cards = getAllByText('Hello');

    // Match all pairs manually
    for (let i = 0; i < cards.length; i += 2) {
      fireEvent.press(cards[i]);
      fireEvent.press(cards[i + 1]);
    }

    await waitFor(() => {
      expect(getByTestId('confetti')).toBeTruthy();
    });
  });

  it('resets the game when New Game button is pressed', () => {
    const {getByText} = render(<FlipCardGame />);
    const newGameButton = getByText('New Game');

    fireEvent.press(newGameButton);

    expect(getByText('Moves: 0')).toBeTruthy();
  });
});
