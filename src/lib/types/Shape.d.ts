interface ShapeProps {
    dragging?: boolean;
    position: Vector;
    zIndex?: number;
    rotation?: number;
    visible?: boolean;
}

interface CircleProps extends ShapeProps {
    radius: number;
    color?: string;
}

interface RectProps extends ShapeProps {
    width: number;
    height: number;
    color?: string;
    borderWidth?: number;
    borderColor?: string;
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

interface ArrowProps extends ShapeProps {
    target: Vector;
    color?: string;
    strokeWidth?: number;
}