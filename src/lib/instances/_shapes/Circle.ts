import { Shape, ShapeProps } from "../Shape";
import { Render } from "../../Render";

export interface CircleProps extends ShapeProps {
    radius: number;
    color?: string;
}

export class Circle extends Shape {
    private _ctx: CanvasRenderingContext2D;

    public radius: number;
    public color: string;

    /**
     * Creates a new circular shape with specified radius and color
     * @param props - Configuration properties for the circle
     * @param render - Render context for drawing operations
     */
    public constructor(props: CircleProps, render: Render) {
        super(props, render);
        this._ctx = render.ctx;
        this.radius = props.radius ?? 10;
        this.color = props.color ?? "#fff";
    }

    /**
     * Renders the circle to the canvas with specified color
     * Draws a filled circle at the current position with the specified radius
     */
    public draw() : void {
        if (!this.visible) return;
        this._ctx.beginPath();
        this._ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this._ctx.fillStyle = this.color;
        this._ctx.fill();
        this._ctx.closePath();
    }

    /**
     * Creates a circular clipping mask for this shape
     * Used for masking operations on the canvas context
     */
    public _mask() : void {
        this._ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    }

    /**
     * Updates the circle state and renders it
     * Calls parent update for common shape behavior, then draws the circle
     */
    public update() : void {
        super.update();
        this.draw();
    }

    /**
     * Checks if the circle intersects with a given boundary rectangle
     * Uses the circle's bounding box for intersection testing
     * @param boundaryX - X coordinate of the boundary
     * @param boundaryY - Y coordinate of the boundary
     * @param boundaryWidth - Width of the boundary
     * @param boundaryHeight - Height of the boundary
     * @returns True if circle intersects with boundary, false otherwise
     */
    public _isShapeInBoundary(boundaryX: number, boundaryY: number, boundaryWidth: number, boundaryHeight: number): boolean {
        const shapeX = this.position.x - this.radius;
        const shapeY = this.position.y - this.radius;
        const shapeWidth = this.radius * 2;
        const shapeHeight = this.radius * 2;
        
        return !(shapeX + shapeWidth < boundaryX || 
            shapeX > boundaryX + boundaryWidth ||
            shapeY + shapeHeight < boundaryY || 
            shapeY > boundaryY + boundaryHeight);
    }

    /**
     * Determines if the circle is currently being clicked by the mouse
     * Uses distance calculation from mouse position to circle center
     * @returns True if mouse is within circle radius, false otherwise
     */
    public _isClicked() : boolean {
        const mouseVector = this._render.mousePositionRelative();
        const distance = mouseVector.sub(this.position).len();
        
        return distance <= this.radius;
    }

    /**
     * Creates a deep copy of this circle with identical properties
     * @returns A new Circle instance with the same configuration
     */
    public clone() : Circle {
        return this._render.creator.Circle({
            position: this.position.clone(),
            radius: this.radius,
            color: this.color,
            zIndex: this.zIndex,
            mask: this.mask,
            rotation: this.rotation,
            visible: this.visible
        });
    }
}