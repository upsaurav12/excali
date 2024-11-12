//import { useEffect, useRef, useState } from "react";
import Konva from 'konva';
import { useRef, useState } from 'react';
import {Stage , Layer , Rect } from 'react-konva';
import {v4 as uuidv4} from 'uuid'

interface Rectangle {
  id: string;
  x: number;
  y: number;
  height: number;
  width: number;
  draggable: boolean;
  cornerRadius: number;
}
/*
export const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [rectangles, setRectangles] = useState([]); // Store all rectangles
  const [input , setInput ] = useState("");
  const [inputPos , setInputPost] = useState()

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "black";
  }, []);

  const handleshape = ({nativeEvent}) => {
    
    const {offsetX , offsetY} = nativeEvent;

    rectangles.forEach((rect) => {
      if (
        offsetX >= rect.x &&
        offsetX <= rect.x + rect.width &&
        offsetY >= rect.y &&
        offsetY <= rect.y + rect.height
      ) {
        console.log("Rectangle clicked:", rect); // Log clicked rectangle
        console.log("All Rectangles:", rectangles); // Log all rectangles
      }
    });
  }

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setStartPoint({ x: offsetX, y: offsetY });
    setIsDrawing(true);
  };

  const finishDrawing = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    const rectWidth = offsetX - startPoint.x;
    const rectHeight = offsetY - startPoint.y;

    // Save the current rectangle to the array
    setRectangles((prevRectangles) => [
      ...prevRectangles,
      { x: startPoint.x, y: startPoint.y, width: rectWidth, height: rectHeight },
    ]);

    setIsDrawing(false); // Stop drawing
  };

  const handleDoubleClick = ({nativeEvent} , e) => {
    const {offsetX , offsetY} = nativeEvent;
    setInputPost({x : offsetX , y: offsetY})
    console.log(offsetX, offsetY , e);
    setInput("")
  }

  const handleinput = (e) => {
    setInput(e.target.value);
  }

  const inputBlur = () => {
    if (input.trim()) {
      const canvas  = canvasRef.current;
      const context = canvas.getContext("2d");

      context.font = "16px Arial";
      context.fillText(input , inputPos.x , inputPos.y);
    }

    setInputPost(null);
    setInput("");
  }

  const drawAllRectangles = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    rectangles.forEach((rect) => {
      context.beginPath();
      context.rect(rect.x, rect.y, rect.width, rect.height);
      context.stroke();
    });
  };

  useEffect(() => {
    drawAllRectangles(); // Draw all stored rectangles whenever `rectangles` state changes
  }, [rectangles]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={1715}

        height={845}
        style={{ border: "1px solid black" }}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onClick={handleshape}
        onDoubleClick={handleDoubleClick}
        className="ml-1 mt-1"
      />

      {inputPos && (
        <input
        type="text"
        value={input}
        onChange={handleinput}
        onBlur={inputBlur}
        style={{
          position: "absolute",
          left: inputPos.x,
          top: inputPos.y,
          background: "transparent",
          border: "1px solid black",
          zIndex: 10,
        }}
        autoFocus
        />
      )}
    </div>
  );
};*/

export const Canvas = () => {
  const stageRef = useRef<Konva.Stage | null>(null); // Initialize the ref with proper typing
  const [rectangles, setRectangles] = useState<Rectangle[]>([]); // Specify that rectangles are objects
  const isPainting = useRef(false);
  const [isClicked , setIsClicked] = useState<boolean>(false);
  const currentShapeId = useRef<string | undefined>(undefined);
  
  const onPointerDown = () => {
    const stage = stageRef.current; // Now stageRef is properly linked
    if(stage) {
      const { x, y } = stage.getPointerPosition() as { x: number; y: number }; // Type the position
      //const pos = stage.getPointerPosition();
      console.log(x, y);
    const id = uuidv4();

    currentShapeId.current = id;
    isPainting.current = true;

    setRectangles((rectangles) => [
      ...rectangles,
      {
        id,
        x,
        y,
        height: 80,
        width: 120,
        draggable: true,
        cornerRadius: 25,
      },
    ]);
    }
    setIsClicked(false);
  };

  const onPointerMove = () => {
    if (!isPainting.current) return; // Check if painting is happening

    const stage = stageRef.current; // Now stageRef is properly linked
    if (stage) {
      const { x, y } = stage.getPointerPosition() as { x: number; y: number }; // Type the position

    setRectangles((rectangles) =>
      rectangles.map((rectangle) => {
        if (rectangle.id === currentShapeId.current) {
          return {
            ...rectangle,
            width: x - rectangle.x,
            height: y - rectangle.y,
          };
        }
        return rectangle;
      })
    );
    }
    //setIsClicked(false)
  };

  const onPointerUp = () => {
    isPainting.current = false;
  };

  const handleRectClicked = () => {
    console.log("Rect was clicke??")
    setIsClicked(!isClicked)
    console.log(isClicked);
  }

  const handleText = () => {
    console.log("White board was clicked")
  }

  return (
    <div className='relative'>
      <button type='submit' className='absolute top-4 left-[50%] z-10 border-2 p-[10px] rounded-[1rem] border-black' onClick={() =>handleRectClicked()}>Rectangle</button>
      <Stage
        onClick={handleText}
        width={window.innerWidth}
        height={window.innerHeight}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerDown={isClicked ? onPointerDown : undefined}
        ref={stageRef} // Attach the ref to the Stage component
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            height={window.innerHeight}
            width={window.innerWidth}
            fill="lightgrey" // Fill color to see the background
          />

          {rectangles.map((rect, index) => (
            <Rect
              key={index}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              strokeWidth={2}
              stroke="black"
              draggable={rect.draggable}
              cornerRadius={rect.cornerRadius}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};
