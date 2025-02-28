import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import TestComp from './TestComp';

describe('TestComp', () => {
  it('should display "Hi" initially', () => {
    const {getByText} = render(<TestComp />);
    expect(getByText('Hi')).toBeTruthy(); // ✅ Initial state check
  });

  it('should change text to "Helo" after pressing the button', () => {
    const {getByTestId, getByText} = render(<TestComp />);

    const button = getByTestId('press-button'); // ✅ Button selection
    fireEvent.press(button); // ✅ Simulate button press

    expect(getByText('Helo')).toBeTruthy(); // ✅ State change verification
  });

  it('should track the show state using spies', () => {
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');

    // Mock `useState` for both states (show & increment)
    useStateSpy.mockImplementationOnce((init: number) => [init, setState]); // For show
    useStateSpy.mockImplementationOnce((init: number) => [init, jest.fn()]); // For increment (unused)

    const {getByTestId} = render(<TestComp />);

    const button = getByTestId('press-button');
    fireEvent.press(button);

    expect(setState).toHaveBeenCalledWith(true); // ✅ Check if state updated to true
  });
});
