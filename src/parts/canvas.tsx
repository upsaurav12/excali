import React, { useState, useRef, useEffect , useCallback } from "react";
import { Stage, Layer, Rect, Transformer , Text as KonvaText, Circle , Arrow  , Line} from "react-konva";
import {  RectangleHorizontal ,MoveUpRight, Spline, Type, Circle as C} from 'lucide-react';
import { Rectangles ,Lines ,Arrows , Circles , Texts } from "./type";
import { v4 as uuidv4 } from "uuid";
import Konva from "konva";


export const Canvas = () => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const [rectangles, setRectangles] = useState<Rectangles[]>([]);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isText , setIsText ] = useState<boolean> (false);
  const [selectedShape , setSelectedShape] = useState<string | null >("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isPainting = useRef(false);
  const [inputPos , setInputPos] = useState<{x: number , y: number} | null>(null)
  const [text , setText] = useState<Texts[]>([]);
  const currentShapeId = useRef<string | undefined>(undefined);
  const [circles , setCircle] = useState<Circles[]>([])
  const [isCircle , setIsCircle] = useState<boolean>(false)
  const [arrows , setArrows] = useState<Arrows[]>([]);
  const [isArrow , setIsArrow] = useState<boolean>(false);
  const [isLine , setIsLine] = useState<boolean>(false);
  const [lines , setLines] = useState<Lines[]>([])
  const [isDelete , setIsDelete] = useState<boolean>(false);


  // Add a new rectangle
  const onPointerDown = () => {
    const stage = stageRef.current;
    if (stage) {
      const { x, y } = stage.getPointerPosition() as { x: number; y: number };
      const id = uuidv4();
      currentShapeId.current = id;
      isPainting.current = true;

      if (selectedShape === 'Rectangle') {
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
      }else if (selectedShape === 'Circle') {
        setCircle((prev) => [...prev,
          {
            id,
            x,
            y,
            radius: 50,
          }
        ])
      }else if  (selectedShape === 'Arrow') {
        setArrows((prev) => [
          ...prev, 
          {
            id,
            points: [x , y , x+50 , y+ 50],
          }
        ])
      } else if (selectedShape === 'Line') {
        setLines((prev) => [
          ...prev , {
            id,
            points: [x, y, x+5 , x+5],
          }
        ])
      }

    }
    setIsText(false)
    setIsCircle(false)
    setIsClicked(false);
    setIsArrow(false);
    setIsLine(false)
  };

  // Select or deselect a rectangle
  const handleSelect = (id: string | null) => {
    setSelectedId(id);
    setIsDelete(!isDelete)
    if (id && transformerRef.current) {
      const selectedNode = stageRef.current?.findOne(`#${id}`);
      console.log(transformerRef.current)
      transformerRef.current.nodes(selectedNode ? [selectedNode] : []);
      transformerRef.current.getLayer()?.batchDraw();
    }
  };

  // Update rectangle dimensions on drag or transform
  const updateRectangleDimensions = (id: string,width: number, height: number) => {
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

      console.log("Pointer moved:", { x, y, selectedShape });
        if (selectedShape == 'Rectangle') {
          setRectangles((prev) =>
            prev.map((rect) =>
              rect.id === currentShapeId.current
                ? { ...rect, width: x - rect.x, height: y - rect.y }
                : rect
            )
          );
        } else if (selectedShape === "Circle") {
          setCircle((prev) =>
            prev.map((circle) => {
              if (circle.id === currentShapeId.current) {
                const dx = x - circle.x;
                const dy = y - circle.y;
                const radius = Math.sqrt(dx * dx + dy * dy);
                return { ...circle, radius };
              }
              return circle;
            })
          );
        } else if (selectedShape === 'Arrow') {
          setArrows((prev) => 
          prev.map((arrow) => 
            arrow.id === currentShapeId.current 
          ? {...arrow , points: [arrow.points[0] , arrow.points[1] , x , y] }
          :arrow
          ))
        }
  
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
  const handleToolClicked = (shape: string) => {
    setSelectedShape(shape);
    if (shape === 'Rectangle') {
      setIsClicked(!isClicked)
    }else if (shape === 'Text') {
      setIsText(!isText)
    }else if (shape === 'Circle') {
      setIsCircle(!isCircle)
    }else if (shape === 'Arrow') {
      setIsArrow(!isArrow)
    }else if (shape === 'Line') {
      setIsLine(!isLine)
    }
  }

  const handleDelete = useCallback(() => {
    if (selectedShape && selectedId) {
      console.log("Deleting", { selectedShape, selectedId });
      switch (selectedShape) {
        case "Rectangle":
          setRectangles((prev) => prev.filter((rect) => rect.id !== selectedId));
          break;
        case "Circle":
          setCircle((prev) => prev.filter((circle) => circle.id !== selectedId));
          break;
        case "Arrow":
          setArrows((prev) => prev.filter((arrow) => arrow.id !== selectedId));
          break;
        case "Line":
          setLines((prev) => prev.filter((line) => line.id !== selectedId));
          break;
        default:
          break;
      }
      setSelectedId(null);
      setSelectedShape(null);
    }
  }, [selectedShape, selectedId, setRectangles, setCircle, setArrows, setLines]);
  

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if(e.key === 'Delete') {
        handleDelete();
      };
    }

    window.addEventListener('keydown' , handleKeyDown)

    return () => {
      window.removeEventListener('keydown' , handleKeyDown)
    }
  } , [handleDelete])
  return (
    <div className="relative">

      {/*}
      <button style={{display: isDelete ? 'block' : 'none'}} onClick={handleDelete}>
        <Trash2/>
      </button>*/}


      <div className="buttons absolute left-[50%] z-10 top-5 border-2 flex w-[300px] rounded-[1rem] justify-around h-[50px]">

          <button type="button" onClick={() => handleToolClicked("Rectangle")}>
            <RectangleHorizontal/>
          </button>
          <button type="button" onClick={() => handleToolClicked("Circle")}>
            <C/>
          </button>
          <button type="button"  onClick={() => handleToolClicked("Arrow")}>
            <MoveUpRight/>
          </button>
          <button type="button"  onClick={() => handleToolClicked("Line")}>
            <Spline/>
          </button>
          <button   onClick={() => handleToolClicked("Text")}>
            <Type/>
          </button>

          {/*}
      {shapes.map((val , idx) => (
        <button className="border-2 border-black p-2 rounded-[0.4rem] ml-2" onClick={() => handleRectClicked(val.type)} key={idx}>{val.type}</button>
      ))}*/}
      </div> 

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onMouseDown={(e) => {
          if (e.target === stageRef.current) {
            handleSelect(null ); // Deselect rectangle if click is outside any shape
          }
        }}
        onPointerDown={isClicked || isCircle || isArrow || isLine? onPointerDown : undefined}
        onClick={isText ? handleText: undefined}
      >
        <Layer>

          {lines.map((l) => (
            <Line 
            id={l.id}
            points={[l.points[0] , l.points[1] , l.points[2] , l.points[3]]}
            stroke="black"
            strokeWidth={3}
            draggable
            onClick={() => handleSelect(l.id )}
            />
          ))}
          {text.map((t) => (
            <KonvaText key={t.id} x={t.x} y={t.y} text={t.text} fontSize={18} draggable fill="black" onClick={() => handleSelect(t.id)}/>
          ))}

          {arrows.map((arrow) => (
            <Arrow id={arrow.id} points={[arrow.points[0] , arrow.points[1] , arrow.points[2] , arrow.points[3]]}
            stroke="black"
            strokeWidth={3}
            draggable
            onClick={() => handleSelect(arrow.id )}
            />
          ))}

          {circles.map((circle) => (
            <Circle 
            id={circle.id}
            x={circle.x}
            y={circle.y}
            radius={circle.radius}
            stroke="black"
            strokeWidth={3}
            onClick={() => handleSelect(circle.id )}

            draggable
            />
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
                    node.height() * scaleY,
                  );
                }}
              />

              {selectedId && (
                <Transformer
                  ref={transformerRef}
                  resizeEnabled={true}
                  rotateEnabled={false}
                  anchorSize={6}
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
