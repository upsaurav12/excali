import { it, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App'; // Import `App` using named import

describe('App Component', () => {
  it('should render App with Canvas', () => {
    render(<App />);
    screen.debug(); // Logs the DOM structure
  });
});
