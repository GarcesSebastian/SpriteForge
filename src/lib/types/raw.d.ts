type ShapeType = "circle" | "rect" | "sprite" | "arrow" | "controller";

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

interface CircleRawData extends ShapeRawData {
    radius: number;
    color: string;
}

interface RectRawData extends ShapeRawData {
    width: number;
    height: number;
    color: string;
    borderWidth: number;
    borderColor: string;
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
    controller?: ControllerRawData;
}

interface ArrowRawData extends ShapeRawData {
    target: Vector;
    color: string;
    strokeWidth: number;
}

interface ControllerRawData {
    id: string
    type: string
    keywords: ControllerKeyWords
    status: ControllerStatus
    speed?: number
    jumpForce?: number
}