import { Rect, Circle, Arrow, Line, Text as KonvaText } from "react-konva";
import { Rectangles, Circles, Arrows, Lines, Texts } from "./type";
import Konva from "konva";
import React from "react";

export const Shapes = React.memo(
  ({
    rectangles,
    circles,
    arrows,
    lines,
    texts,
    onShapeSelect,
    updateRectangleDimensions,
  }: {
    rectangles: Rectangles[];
    circles: Circles[];
    arrows: Arrows[];
    lines: Lines[];
    texts: Texts[];
    onShapeSelect: (id: string | null) => void;
    updateRectangleDimensions: (id: string, width: number, height: number) => void;
  }) => (
    <>
      {rectangles.map((rect) => (
        <Rect
          key={rect.id}
          id={rect.id}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          stroke="black"
          cornerRadius={rect.cornerRadius}
          draggable
          onClick={() => onShapeSelect(rect.id)}
          onTransformEnd={(e) => {
            const node = e.target as Konva.Rect;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            updateRectangleDimensions(rect.id, node.width() * scaleX, node.height() * scaleY);
          }}
        />
      ))}
      {circles.map((circle) => (
        <Circle
          key={circle.id}
          id={circle.id}
          x={circle.x}
          y={circle.y}
          radius={circle.radius}
          stroke="black"
          draggable
          onClick={() => onShapeSelect(circle.id)}
        />
      ))}
      {arrows.map((arrow) => (
        <Arrow
          key={arrow.id}
          id={arrow.id}
          points={arrow.points}
          stroke="black"
          draggable
          onClick={() => onShapeSelect(arrow.id)}
        />
      ))}
      {lines.map((line) => (
        <Line
          key={line.id}
          id={line.id}
          points={line.points}
          stroke="black"
          draggable
          onClick={() => onShapeSelect(line.id)}
        />
      ))}
      {texts.map((text) => (
        <KonvaText
          key={text.id}
          x={text.x}
          y={text.y}
          text={text.text}
          fontSize={18}
          draggable
          fill="black"
          onClick={() => onShapeSelect(text.id)}
        />
      ))}
    </>
  )
);
