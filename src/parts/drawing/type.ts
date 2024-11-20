export interface Rectangles {
    id: string;
    x: number;
    y: number;
    height: number;
    width: number;
    draggable: boolean;
    cornerRadius?: number;
  }
  
export interface Texts {
    id: string;
    x: number;
    y:number;
    text: string;
  }
  
export interface Circles {
    id: string;
    x: number;
    y: number;
    radius: number;
  }
  
export interface Arrows {
    id: string,
    points : [x: number , y: number , xc: number , yc:number ],
  }
  
export interface Lines {
    id: string;
    points : [x: number , y:number , xc: number , yc: number],
  }
  