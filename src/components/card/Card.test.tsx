import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Card from './Card';
import {CardTypes} from 'src/types/Generic';

describe('Card Component', () => {
  const mockHandleChoice = jest.fn();
  const mockCard = {
    src: 'https://example.com/image.png',
    id: 1,
    uniqueId: '20',
    matched: false,
  };

  it('should render front and back faces', () => {
    const {getByText, getByRole} = render(
      <Card
        card={mockCard}
        handleChoice={mockHandleChoice}
        flipped={false}
        disabled={false}
      />,
    );

    // Check if the front face renders text
    expect(getByText('Hello')).toBeTruthy();

    // Check if back image renders correctly
    const image = getByRole('image');
    expect(image.props.source.uri).toBe(mockCard.src);
  });

  it('should call handleChoice when pressed', () => {
    const {getByRole} = render(
      <Card
        card={mockCard}
        handleChoice={mockHandleChoice}
        flipped={false}
        disabled={false}
      />,
    );

    const button = getByRole('button');
    fireEvent.press(button);

    expect(mockHandleChoice).toHaveBeenCalledWith(mockCard);
  });

  it('should not call handleChoice when disabled', () => {
    const {getByRole} = render(
      <Card
        card={mockCard}
        handleChoice={mockHandleChoice}
        flipped={false}
        disabled={true}
      />,
    );

    const button = getByRole('button');
    fireEvent.press(button);

    expect(mockHandleChoice).not.toHaveBeenCalled();
  });

  it('should apply flipped animation style when flipped is true', () => {
    const {getByText} = render(
      <Card
        card={mockCard}
        handleChoice={mockHandleChoice}
        flipped={true}
        disabled={false}
      />,
    );

    const frontFace = getByText('Hello').parent;
    expect(frontFace.props.style[1].transform).toEqual([{rotateY: '180deg'}]);
  });
});
