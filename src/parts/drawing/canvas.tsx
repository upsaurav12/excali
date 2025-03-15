import{ useState, useRef , useCallback } from "react";
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
            cornerRadius: 10,
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
            points: [x, y, x+50 , x+50],
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
  const handleSelect = useCallback(
    (id: string | null) => {
      setSelectedId(id);
      setIsDelete(!isDelete);
  
      if (id && transformerRef.current) {
        //console.log("This is the id 2", id)
        const selectedNode = stageRef.current?.findOne(`#${id}`);
        //console.log("bruh", selectedNode)
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]); // Attach the Transformer to the selected shape
          transformerRef.current.getLayer()?.batchDraw();
        }
      } else if (transformerRef.current) {
        transformerRef.current.nodes([]); // Deselect Transformer
      }
    },
    [isDelete]
  );
  

  // Update rectangle dimensions on drag or transform
  const updateRectangleDimensions = (id: string,width: number, height: number) => {
    setRectangles((prev) =>
      prev.map((rect) =>
        rect.id === id ? { ...rect, width, height } : rect
      )
    );
  };

  const updateTextDimensions = (id: string,width: number, height: number) => {
    setText((prev) =>
      prev.map((text) =>
        text.id === id ? { ...text, width, height } : text
      )
    );
  };


  // Handle pointer move to resize
  const onPointerMove = () => {
    if (!isPainting.current) return;

    const stage = stageRef.current;
    if (stage) {
      const { x, y } = stage.getPointerPosition() as { x: number; y: number };
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
          onShapeSelect={(id) => {handleSelect(id)
            console.log("Hello world", id)
          }}
          updateRectangleDimensions={updateRectangleDimensions}
          updateTextDimensions={updateTextDimensions}
          />
          {selectedId && (
                <Transformer
                  ref={transformerRef}
                  resizeEnabled={true}
                  rotateEnabled={true}
                  anchorSize={7}
                  padding={8}
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
