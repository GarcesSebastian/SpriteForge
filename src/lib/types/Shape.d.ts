type ShapeType = "circle" | "rect" | "sprite" | "arrow";

interface ShapeProps {
    dragging?: boolean;
    position: Vector;
    zIndex?: number;
    mask?: boolean;
    rotation?: number;
    visible?: boolean;
}

interface ShapeRawData {
    id: string;
    type: ShapeType;
    position: Vector;
    rotation: number;
    zIndex: number;
    mask: boolean;
    dragging: boolean;
    visible: boolean;
}

interface CircleProps extends ShapeProps {
    radius: number;
    color?: string;
}

interface CircleRawData extends ShapeRawData {
    radius: number;
    color: string;
}

interface RectProps extends ShapeProps {
    width: number;
    height: number;
    color?: string;
    borderWidth?: number;
    borderColor?: string;
}

interface RectRawData extends ShapeRawData {
    width: number;
    height: number;
    color: string;
    borderWidth: number;
    borderColor: string;
}

interface SpriteProps extends ShapeProps {
    src: string;
    spriteGrid: SpriteGrid;
    ignoreFrames?: number[]; 
    startFrame?: number;
    endFrame?: number;
    pattern?: string[];
    scale?: number;
    speed?: number;
    loop?: boolean;
}

interface SpriteRawData extends ShapeRawData {
    src: string;
    spriteGrid: SpriteGrid;
    ignoreFrames: number[]; 
    startFrame: number;
    endFrame: number;
    pattern: string[];
    scale: number;
    speed: number;
    loop: boolean;
}

interface ArrowProps extends ShapeProps {
    target: Vector;
    color?: string;
    strokeWidth?: number;
}

interface ArrowRawData extends ShapeRawData {
    target: Vector;
    color: string;
    strokeWidth: number;
}
