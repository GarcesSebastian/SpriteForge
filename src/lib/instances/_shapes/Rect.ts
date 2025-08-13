import { Shape, ShapeProps } from "../Shape";
import { Render } from "../../Render";

export interface RectProps extends ShapeProps {
    width: number;
    height: number;
    color?: string;
}

export class Rect extends Shape {
    private _ctx: CanvasRenderingContext2D;

    public width: number;
    public height: number;
    public color: string;

    public constructor(props: RectProps, render: Render) {
        super(props, render);
        this._ctx = render.ctx;
        this.width = props.width;
        this.height = props.height;
        this.color = props.color ?? "white";
    }

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

    public _mask() : void {
        this._ctx.rect(this.position.x, this.position.y, this.width, this.height);
    }

    public draw(): void {
        this._ctx.save();
        this._ctx.translate(this.position.x, this.position.y);
        this._ctx.rotate(this.rotation);
        this._ctx.beginPath();
        this._ctx.rect(0, 0, this.width, this.height);
        this._ctx.fillStyle = this.color;
        this._ctx.fill();
        this._ctx.closePath();
        this._ctx.restore();
    }

    public update(): void {
        this.draw();
    }

    public destroy(): void {
        super.destroy();
    }
}