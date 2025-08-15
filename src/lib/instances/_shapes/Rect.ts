import { Shape, ShapeProps } from "../Shape";
import { Render } from "../../Render";

export interface RectProps extends ShapeProps {
    width: number;
    height: number;
    color?: string;
    borderWidth?: number;
    borderColor?: string;
}

export class Rect extends Shape {
    private _ctx: CanvasRenderingContext2D;

    public width: number;
    public height: number;
    public color: string;
    public borderWidth: number;
    public borderColor: string;

    /**
     * Creates a new rectangular shape with specified dimensions and styling
     * @param props - Configuration properties for the rectangle
     * @param render - Render context for drawing operations
     */
    public constructor(props: RectProps, render: Render) {
        super(props, render);
        this._ctx = render.ctx;
        this.width = props.width;
        this.height = props.height;
        this.color = props.color ?? "white";
        this.borderWidth = props.borderWidth ?? 0;
        this.borderColor = props.borderColor ?? "transparent";
    }

    /**
     * Checks if the rectangle intersects with a given boundary area
     * @param boundaryX - X coordinate of the boundary
     * @param boundaryY - Y coordinate of the boundary
     * @param boundaryWidth - Width of the boundary
     * @param boundaryHeight - Height of the boundary
     * @returns True if rectangle intersects with boundary, false otherwise
     */
    public _isShapeInBoundary(boundaryX: number, boundaryY: number, boundaryWidth: number, boundaryHeight: number): boolean {
        return !(this.position.x + this.width < boundaryX || 
            this.position.x > boundaryX + boundaryWidth ||
            this.position.y + this.height < boundaryY || 
            this.position.y > boundaryY + boundaryHeight);
    }

    /**
     * Determines if the rectangle is currently being clicked by the mouse
     * Handles both non-rotated and rotated rectangle collision detection
     * @returns True if mouse is clicking within rectangle bounds, false otherwise
     */
    public _isClicked() : boolean {
        const mouseVector = this._render.mousePositionRelative();
        
        if (this.rotation === 0) {
            return mouseVector.x >= this.position.x && 
                   mouseVector.x <= this.position.x + this.width &&
                   mouseVector.y >= this.position.y && 
                   mouseVector.y <= this.position.y + this.height;
        }
        
        const dx = mouseVector.x - this.position.x;
        const dy = mouseVector.y - this.position.y;
        
        const cos = Math.cos(-this.rotation);
        const sin = Math.sin(-this.rotation);
        
        const localX = dx * cos - dy * sin;
        const localY = dx * sin + dy * cos;
        
        return localX >= 0 && 
               localX <= this.width &&
               localY >= 0 && 
               localY <= this.height;
    }

    /**
     * Creates a rectangular clipping mask for this shape
     * Used for masking operations on the canvas context
     */
    public _mask() : void {
        this._ctx.rect(this.position.x, this.position.y, this.width, this.height);
    }

    /**
     * Renders the rectangle to the canvas with fill color and optional border
     * Applies transformations (position, rotation) and styling (color, border)
     */
    public draw(): void {
        if (!this.visible) return;
        this._ctx.save();
        this._ctx.translate(this.position.x, this.position.y);
        this._ctx.rotate(this.rotation);

        this._ctx.beginPath();

        this._ctx.rect(0, 0, this.width, this.height);
        this._ctx.fillStyle = this.color;
        this._ctx.fill();
        this._ctx.lineWidth = this.borderWidth;
        this._ctx.strokeStyle = this.borderColor;
        this._ctx.stroke();

        this._ctx.closePath();

        this._ctx.restore();
    }

    /**
     * Updates the rectangle state and renders it
     * Calls parent update for common shape behavior, then draws the rectangle
     */
    public update(): void {
        super.update();
        this.draw();
    }

    /**
     * Creates a deep copy of this rectangle with identical properties
     * @returns A new Rect instance with the same configuration
     */
    public clone() : Rect {
        return this._render.creator.Rect({
            position: this.position.clone(),
            width: this.width,
            height: this.height,
            color: this.color,
            borderWidth: this.borderWidth,
            borderColor: this.borderColor,
            zIndex: this.zIndex,
            mask: this.mask,
            rotation: this.rotation,
            visible: this.visible
        });
    }
}