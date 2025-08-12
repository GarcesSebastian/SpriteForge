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

    public constructor(props: CircleProps, render: Render) {
        super(props, render);
        this._ctx = render.ctx;
        this.radius = props.radius ?? 10;
        this.color = props.color ?? "#fff";
    }

    public draw() : void {
        this._ctx.beginPath();
        this._ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this._ctx.fillStyle = this.color;
        this._ctx.fill();
        this._ctx.closePath();
    }

    public update() : void {
        super.update();
        this.draw();
    }
}