import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app mock text', () => {
  render(<App />);
  const text = screen.getByText(/APP/i);
  expect(text).toBeInTheDocument();
});
