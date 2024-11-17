import { it, expect, describe } from 'vitest';
import { Canvas } from './canvas';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import 'vitest-canvas-mock';

describe('Canvas Component', () => {
  it('Renders Canvas without Crashing', () => {
    render(<Canvas />);

    // Use getByTestId to query the canvas element
    const canvasStage = screen.getByRole('region')
    expect(canvasStage).toBeInTheDocument();
  });

  it('should render the rectangle button' ,  () => {
    render(<Canvas/>)
    const rectangeButton = screen.getByRole('button' , {name: 'Rectangle'})

    expect(rectangeButton).toBeInTheDocument();
  })

  it('should render circle button' , () => {
    render(<Canvas/>)

    const circleButton = screen.getByRole('button' , {name: 'Circle'})

    expect(circleButton).toBeInTheDocument()
  })

  it('should render arrow button' , () => {
    render(<Canvas/>)

    const arrowButton = screen.getByRole('button' , {name: 'Arrow'})

    expect(arrowButton).toBeInTheDocument()
  })

  
  
  it('should rende line button' , () => {
    render(<Canvas/>)

    const lineButton = screen.getByRole('button' , {name: 'Line'})

    expect(lineButton).toBeInTheDocument()
  })

  it('should render Text button' , () => {
    render(<Canvas/>)

    const textButton = screen.getByRole('button' , {name: 'Text'})

    expect(textButton).toBeInTheDocument()
  })


  

});
