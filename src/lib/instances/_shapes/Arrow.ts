import { Shape } from "../Shape";
import { Render } from "../../Render";
import { Vector } from "@/lib/common/Vector";

export class Arrow extends Shape {
    private _ctx: CanvasRenderingContext2D;

    public target: Vector;
    public color: string;
    public strokeWidth: number;
    
    private _angle: number;
    private _direction: Vector;

    constructor(props: ArrowProps, render: Render) {
        super(props, render);
        this._ctx = render.ctx;
        this.target = props.target;
        this.color = props.color ?? "#fff";
        this.strokeWidth = props.strokeWidth ?? 3;

        this._angle = Math.atan2(this.target.y - this.position.y, this.target.x - this.position.x);
        this._direction = new Vector(Math.cos(this._angle), Math.sin(this._angle));
    }

    public get direction(): Vector {
        return this._direction;
    }

    public draw(): void {
        if (!this.visible) return;
        
        this._angle = Math.atan2(this.target.y - this.position.y, this.target.x - this.position.x);
        this._direction = new Vector(Math.cos(this._angle), Math.sin(this._angle));
        
        this._ctx.save();
        this._ctx.strokeStyle = this.color;
        this._ctx.fillStyle = this.color;
        this._ctx.lineWidth = this.strokeWidth;
        this._ctx.lineCap = "round";
        this._ctx.lineJoin = "round";
    
        const arrowSize = this.strokeWidth * 5;
    
        const xFinal = this.target.x - arrowSize * Math.cos(this._angle);
        const yFinal = this.target.y - arrowSize * Math.sin(this._angle);
    
        this._ctx.beginPath();
        this._ctx.moveTo(this.position.x, this.position.y);
        this._ctx.lineTo(xFinal, yFinal);
        this._ctx.stroke();
    
        this._ctx.beginPath();
        this._ctx.moveTo(this.target.x, this.target.y);
        this._ctx.lineTo(
            this.target.x - arrowSize * Math.cos(this._angle - Math.PI / 6),
            this.target.y - arrowSize * Math.sin(this._angle - Math.PI / 6)
        );
        this._ctx.lineTo(
            this.target.x - arrowSize * Math.cos(this._angle + Math.PI / 6),
            this.target.y - arrowSize * Math.sin(this._angle + Math.PI / 6)
        );
        this._ctx.closePath();
        this._ctx.fill();
        
        this._ctx.restore();
    }

    public update(): void {
        super.update();
        this.draw();
    }

    public _isClicked(): boolean {
        return false;
    }

    public _isShapeInBoundary(boundaryX: number, boundaryY: number, boundaryWidth: number, boundaryHeight: number): boolean {
        return false;
    }

    public _mask(): void {}

    public clone(): Arrow {
        return this._render.creator.Arrow({
            ...this,
            position: this.position.clone(),
        });
    }

    /**
     * @internal
     * Returns the raw data of the arrow.
     * @returns The raw data of the arrow.
     */
    public _rawData() : ArrowRawData {
        return {
            id: this.id,
            type: "arrow",
            position: this.position,
            rotation: this.rotation,
            zIndex: this.zIndex,
            mask: this.mask,
            dragging: this.dragging,
            visible: this.visible,
            target: this.target,
            color: this.color,
            strokeWidth: this.strokeWidth,
        };
    }

    /**
     * @internal
     * Creates a new arrow instance from raw data.
     * @param data - The raw data of the arrow.
     * @returns A new `Arrow` instance with identical properties.
     */
    public static _fromRawData(data: ArrowRawData, render: Render) : Arrow {
        const arrow = render.creator.Arrow(data);
        arrow.position = data.position;
        arrow.rotation = data.rotation;
        arrow.zIndex = data.zIndex;
        arrow.mask = data.mask;
        arrow.dragging = data.dragging;
        arrow.visible = data.visible;
        arrow.target = data.target;
        arrow.color = data.color;
        arrow.strokeWidth = data.strokeWidth;
        arrow.id = data.id;

        return arrow;
    }
}