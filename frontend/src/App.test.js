import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('renders home page heading', () => {
  render(
      <App />
  );

  const heading = screen.getByText(/Flakes/i);
  expect(heading).toBeInTheDocument();
});