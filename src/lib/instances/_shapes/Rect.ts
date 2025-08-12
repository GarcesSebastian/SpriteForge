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

    public draw(): void {
        this._ctx.beginPath();
        this._ctx.rect(this.position.x, this.position.y, this.width, this.height);
        this._ctx.fillStyle = this.color;
        this._ctx.fill();
        this._ctx.closePath();
    }

    public update(): void {
        this.draw();
    }
}