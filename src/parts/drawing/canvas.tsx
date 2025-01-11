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
  const [activeInput , setActiveInput] = useState<string | null>(null);
  const [isText , setIsText ] = useState<boolean> (false);
  const [selectedShape , setSelectedShape] = useState<string | null >("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isPainting = useRef(false);
  const [inputPos , setInputPos] = useState<{x: number , y: number} | null>(null)
  const [text , setText] = useState<Texts[]>([]);
  const [inputisActive , setInputisActive] = useState<boolean>(false);
  const currentShapeId = useRef<string | undefined>(undefined);
  const [circles , setCircle] = useState<Circles[]>([])
  const [isCircle , setIsCircle] = useState<boolean>(false)
  const [arrows , setArrows] = useState<Arrows[]>([]);
  const [isArrow , setIsArrow] = useState<boolean>(false);
  const [isLine , setIsLine] = useState<boolean>(false);
  const [lines , setLines] = useState<Lines[]>([])
  const [isDelete , setIsDelete] = useState<boolean>(false);
  const [inputArray , setInputArray] = useState<{x: number , y: number , height:number , width:number}[]>([]);

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
  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id);
    setIsDelete(!isDelete)
    if (id && transformerRef.current) {
      const selectedNode = stageRef.current?.findOne(`#${id}`);
      transformerRef.current.nodes(selectedNode ? [selectedNode] : []);
      transformerRef.current.getLayer()?.batchDraw();
    }
  } ,[isDelete]);

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

  const stringToShape = (input: string | null) => {
    const matches = input?.match(/r:h-(\d+)\s*w-(\d+)(?:\s*l-(\d+))?\s*x-(\d+)\s*y-(\d+)/);

    if (matches) {
      const height1 = Number(matches[1]);
    const width1 = Number(matches[2]);
    const x1 = Number(matches[4]);
    const y1 = Number(matches[5]);
    setInputArray((prev) => [
      ...prev , {
        width: width1,
        height: height1,
        x: x1,
        y:y1
      }
    ])
    console.log(inputArray)
     return { height1, width1, x1, y1 };
    }


    return null
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Parse the input expression to extract the shape properties
    const parsedValues = stringToShape(activeInput);
  
    if (parsedValues) {
      // Extract the parsed values (height, width, x, y)
  
      // Log to check the parsed values

      const { height1, width1, x1, y1 } = parsedValues;
      console.log("Shape properties:", { height1, width1, x1, y1 });
  
      // Create the rectangle using the parsed values
      const id = uuidv4(); // Unique ID for the shape
  
      // Add the new rectangle to the state
      setRectangles((prev) => [
        ...prev,
        {
          id,
          x: x1, // x position from input
          y : y1, // y position from input
          width: width1, // width from input
          height: height1, // height from input
          draggable: true, // Make the shape draggable
          cornerRadius: 10, // Optional corner radius for the rectangle
        },
      ]);
  
      // Optionally clear the input field after submission
      setActiveInput("");
    } else {
      // Handle invalid input
      console.log("Invalid input format.");
    }
  };

  const handleDelete = useCallback(() => {
    if (selectedShape && selectedId) {
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
/*
        switch (e.key.toLowerCase()) {
          case 'r':
            { setIsClicked(false);
            setSelectedShape("Rectangle")

            const rectProps = inputArray.length > 0 ? inputArray[inputArray.length - 1] : { x: 150, y: 150, width: 120, height: 80 };
            
            setRectangles((prev) => [
              ...prev , 
              {
                id,
                x: rectProps.x,
                y: rectProps.y,
                height:rectProps.height,
                width: rectProps.width,
                draggable: true,
                cornerRadius: 25,
              }
            ])
            break }  
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
*/
      
      switch (e.key.toLowerCase()) {
        case 'p' :
          setInputisActive(true)
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
                  padding={10}
                />
              )}
        </Layer>
      </Stage>

      <form action="" style={{display: inputisActive ? 'block' : 'none'}} onSubmit={handleSubmit} className="absolute left-[40%] w-[35%] bottom-[10%] flex justify-around">
        <input type="text" style={{
          zIndex: 9999, // Ensure it's above other elements
          background: 'white', // Ensure visibility
        }} 
        value={activeInput ?? ""}
        className="border-2 border-black p-3 w-[60%] rounded-[0.75rem] outline-none"
        onChange={(e) => setActiveInput(e.target.value)}
        />

        <button type="submit" className="border-2 border-black px-5 h-[50px] mt-1 rounded-[0.75rem] ml-[10%]">Click</button>
      </form>


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
