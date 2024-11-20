import {  RectangleHorizontal ,MoveUpRight, Spline, Type, Circle as C} from 'lucide-react';


export const Toolbar = ({onToolSelect }: {onToolSelect : (tool : string) => void}) => {
    return (
        <>
        <div className="buttons absolute left-[50%] z-10 top-5 border-2 flex w-[300px] rounded-[1rem] justify-around h-[50px]">

            <button type="button" aria-label="Rectangle" onClick={() => onToolSelect("Rectangle")}>
                <RectangleHorizontal />
            </button>

            <button type="button" aria-label="Circle" onClick={() => onToolSelect("Circle")}>
                <C/>
            </button>
            
            <button type="button" aria-label="Arrow" onClick={() => onToolSelect("Arrow")}>
                <MoveUpRight/>
            </button>

            <button type="button"  aria-label="Line" onClick={() => onToolSelect("Line")}>
                <Spline/>
            </button>

            <button  aria-label="Text" onClick={() => onToolSelect("Text")}>
                <Type/>
            </button>

{/*}
{shapes.map((val , idx) => (
<button className="border-2 border-black p-2 rounded-[0.4rem] ml-2" onClick={() => handleRectClicked(val.type)} key={idx}>{val.type}</button>
))}*/}
</div> 
        </>
    )
}