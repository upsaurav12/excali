import{ useState, useRef, useEffect , useCallback } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import { Rectangles ,Lines ,Arrows , Circles , Texts } from "./type";
import { v4 as uuidv4 } from "uuid";
import Konva from "konva";
import { Shapes } from "./shapes";
import { Toolbar } from "./toolbar";


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
      const id = uuidv4();
      currentShapeId.current = id;

      switch (e.key.toLowerCase()) {
        case 'r':
          setSelectedShape("Rectangle");
          setIsClicked(false);
          setRectangles((prev) => [
            ...prev , 
            {
              id,
              x: 150,
              y: 150,
              height:80,
              width: 120,
              draggable: true,
              cornerRadius: 25,
            }
          ])
          break  
        case 'c' :
          setSelectedShape('Circle');
          setIsCircle(false)
          setCircle((prev) => [
            ...prev , {
              id,
              x: 300,
              y: 300,
              radius: 100
            }
          ])
          break  
        case 'a' :
          setSelectedShape('Arrow');
          setIsArrow(false)
          setArrows((prev) => [
            ...prev , {
              id,
              points: [400 , 400 , 450 , 450],
            }
          ])
          break
        case 'l' :
          setSelectedShape('Line');
          setIsLine(false)
          setLines((prev) => [
            ...prev , {
              id,
              points : [500 , 500 , 550 , 550],
            }
          ])
          break
      default:
        break;
      }
    }

    window.addEventListener('keydown' , handleKeyDown)

    return () => {
      window.removeEventListener('keydown' , handleKeyDown)
    }
  } , [handleDelete])
  return (
    <div className="relative">

      <Toolbar
      onToolSelect={handleToolClicked}
      />
      <Stage
        role="region"
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

          <Shapes 
          rectangles={rectangles}
          circles={circles}
          arrows={arrows}
          lines={lines}
          texts={text}
          onShapeSelect={handleSelect}
          updateRectangleDimensions={updateRectangleDimensions}
          />
          {selectedId && (
                <Transformer
                  ref={transformerRef}
                  resizeEnabled={true}
                  rotateEnabled={true}
                  anchorSize={6}
                />
              )}
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
