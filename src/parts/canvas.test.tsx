import { it, expect, describe, beforeEach } from 'vitest';
import { Canvas } from './canvas';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import 'vitest-canvas-mock';

describe('Canvas Component', () => {
  beforeEach(() => {
    // Render the Canvas component once before each test
    render(<Canvas />);
  });

  it('Renders Canvas without Crashing', () => {
    const canvasStage = screen.getByRole('region');
    expect(canvasStage).toBeInTheDocument();
  });

  it('should render the rectangle button', () => {
    const rectangleButton = screen.getByRole('button', { name: 'Rectangle' });
    expect(rectangleButton).toBeInTheDocument();
  });

  it('should render the circle button', () => {
    const circleButton = screen.getByRole('button', { name: 'Circle' });
    expect(circleButton).toBeInTheDocument();
  });

  it('should render the arrow button', () => {
    const arrowButton = screen.getByRole('button', { name: 'Arrow' });
    expect(arrowButton).toBeInTheDocument();
  });

  it('should render the line button', () => {
    const lineButton = screen.getByRole('button', { name: 'Line' });
    expect(lineButton).toBeInTheDocument();
  });

  it('should render the text button', () => {
    const textButton = screen.getByRole('button', { name: 'Text' });
    expect(textButton).toBeInTheDocument();
  });
});
