import React, { useState, useRef } from "react";
import { Stage, Layer, Rect, Transformer , Text as KonvaText } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import Konva from "konva";

interface Rectangle {
  id: string;
  x: number;
  y: number;
  height: number;
  width: number;
  draggable: boolean;
  cornerRadius?: number;
}

interface Text {
  id: string;
  x: number;
  y:number;
  text: string;
}

export const Canvas = () => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isText , setIsText ] = useState<boolean> (false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isPainting = useRef(false);
  const [inputPos , setInputPos] = useState<{x: number , y: number} | null>(null)
  const [text , setText] = useState<Text[]>([]);
  const currentShapeId = useRef<string | undefined>(undefined);

  // Add a new rectangle
  const onPointerDown = () => {
    const stage = stageRef.current;
    if (stage) {
      const { x, y } = stage.getPointerPosition() as { x: number; y: number };
      const id = uuidv4();
      currentShapeId.current = id;
      isPainting.current = true;

      setRectangles((prev) => [
        ...prev,
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
    setIsText(false)
    //setIsCircle(false)
    setIsClicked(false);
  };

  // Select or deselect a rectangle
  const handleSelect = (id: string | null) => {
    setSelectedId(id);
    if (id && transformerRef.current) {
      const selectedNode = stageRef.current?.findOne(`#${id}`);
      console.log(transformerRef.current)
      transformerRef.current.nodes(selectedNode ? [selectedNode] : []);
      transformerRef.current.getLayer()?.batchDraw();
    }
  };

  // Update rectangle dimensions on drag or transform
  const updateRectangleDimensions = (
    id: string,
    width: number,
    height: number
  ) => {
    setRectangles((prev) =>
      prev.map((rect) =>
        rect.id === id ? { ...rect, width, height } : rect
      )
    );
  };

  // Handle pointer move to resize
  const onPointerMove = () => {
    if (!isPainting.current) return;

    const stage = stageRef.current;
    if (stage) {
      const { x, y } = stage.getPointerPosition() as { x: number; y: number };

      setRectangles((prev) =>
        prev.map((rect) =>
          rect.id === currentShapeId.current
            ? { ...rect, width: x - rect.x, height: y - rect.y }
            : rect
        )
      );
    }
  };

  // Stop painting
  const onPointerUp = () => {
    isPainting.current = false;
  };

  const handleText = () => {
    const stage  = stageRef.current;
    if (stage && isText) {
      const {x , y} = stage.getPointerPosition() as {x : number , y : number};
      console.log(x , y);
      setInputPos({x , y})
    }
    setIsText(!isText)
  }

  const addTextelement = (text: string) => {
    if (inputPos) {
      setText((prev) => [
        ...prev , 
        {
          id: uuidv4(),
          x: inputPos.x,
          y: inputPos.y,
          text,
        }
      ])
      setInputPos(null)
    }
  }

  // Handle adding a new rectangle
  const handleRectClicked = () => {
    setIsClicked(!isClicked);
    setIsClicked(true)
  };


  return (
    <div className="relative">
      <div className="buttons absolute left-[50%] z-10 top-5">
      <button
        type="button"
        className="z-10 border-2 p-[10px] rounded-[1rem] border-black"
        onClick={handleRectClicked}
      >
      Rectangle
      </button>
      <button  className="p-[10px] rounded-[1rem] border-black border-2 ml-3" onClick={handleText}>Text</button> 
      </div> 

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onMouseDown={(e) => {
          if (e.target === stageRef.current) {
            handleSelect(null); // Deselect rectangle if click is outside any shape
          }
        }}
        onPointerDown={isClicked ? onPointerDown : undefined}
        onClick={isText ? handleText: undefined}
      >
        <Layer>
          {text.map((t) => (
            <KonvaText key={t.id} x={t.x} y={t.y} text={t.text} fontSize={18} draggable fill="black"/>
          ))}
          {rectangles.map((rect) => (
            <React.Fragment key={rect.id}>
              <Rect
                id={rect.id}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                strokeWidth={3}
                stroke="black"
                cornerRadius={rect.cornerRadius}
                draggable={rect.draggable}
                onClick={() => handleSelect(rect.id)}
                onTransformEnd={(e) => {
                  const node = e.target as Konva.Rect;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  node.scaleX(1);
                  node.scaleY(1);
                  updateRectangleDimensions(
                    rect.id,
                    node.width() * scaleX,
                    node.height() * scaleY
                  );
                }}
              />

              {selectedId === rect.id && (
                <Transformer
                  ref={transformerRef}
                  resizeEnabled={true}
                  rotateEnabled={false}
                />
              )}
            </React.Fragment>
          ))}
        </Layer>
      </Stage>

      {inputPos && (
        <input style={{
          position: 'absolute',
          top: inputPos.y,
          left: inputPos.x,
          zIndex: 10,
          
        }}
        onBlur={(e) => addTextelement(e.target.value)}
          autoFocus
        />
      )}
    </div>
  );
};
