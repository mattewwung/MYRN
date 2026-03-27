import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

describe('App home testing', () => {
  test('renders correctly', async () => {
    render(<App />);

    await screen.findByTestId('battery_level');
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('current battery level is displayed', async () => {
    render(<App />);
    // const batteryText = await screen.findByText(/当前电量：10/);
    // expect(batteryText).toBeTruthy();

    const batteryLevel = await screen.findByTestId('battery_level');
    expect(batteryLevel).toHaveTextContent('当前电量：10');
  });
 })
