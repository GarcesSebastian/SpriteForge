import { Shape, ShapeProps } from "../Shape";
import { Render } from "../../Render";
import { Vector } from "../../common/Vector";
import { RenderEventsProps } from "@/lib/helpers/Render.events";

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
    
    private _dragging: boolean = false;
    private _dragStart: Vector | null = null;
    
    private _onClickedBind: (event: MouseEvent) => void = this._onClicked.bind(this);
    private _onMouseDownBind: (event: MouseEvent) => void = this._onMouseDown.bind(this);
    private _onMouseMoveBind: (event: MouseEvent) => void = this._onMouseMove.bind(this);
    private _onMouseUpBind: (event: MouseEvent) => void = this._onMouseUp.bind(this);

    public constructor(props: RectProps, render: Render) {
        super(props, render);
        this._ctx = render.ctx;
        this.width = props.width;
        this.height = props.height;
        this.color = props.color ?? "white";

        this.events();
    }

    private _constructArgs(xa: number, ya: number, xr: number, yr: number, target: Shape) : RenderEventsProps {
        return {
            pointer: {
                absolute: this._render.creator.Vector(xa, ya),
                relative: this._render.creator.Vector(xr, yr)
            },
            target
        }
    }

    private events() : void {
        window.addEventListener("click", this._onClickedBind)
        window.addEventListener("mousedown", this._onMouseDownBind)
        window.addEventListener("mousemove", this._onMouseMoveBind)
        window.addEventListener("mouseup", this._onMouseUpBind)
    }

    private _onClicked(event: MouseEvent) : void {
        if (!this._isClicked()) return;
        this.emit("click", this._constructArgs(event.clientX, event.clientY, event.clientX, event.clientY, this));
    }

    private _onMouseDown(event: MouseEvent) : void {
        if (!this.dragging) return;
        if (!this._render._isDragTarget(this)) return;
        
        const mouseVector = this._render.mousePositionRelative();
        const { clientX, clientY } = event;

        if (!this._isClicked()) return;

        this._render._dragTarget(this);
        this._dragStart = mouseVector.sub(this.position);
        this._dragging = true;
        this.emit("dragstart", this._constructArgs(clientX, clientY, mouseVector.x, mouseVector.y, this));
    }

    private _onMouseMove(event: MouseEvent) : void {
        if (!this._dragging) return;
        
        const { clientX, clientY } = event;
        const { left, top } = this._render.canvas.getBoundingClientRect();
        const mouseVector = this._render.creator.Vector(clientX - left, clientY - top);

        this.position = mouseVector.sub(this._dragStart!);
        this.emit("drag", this._constructArgs(clientX, clientY, mouseVector.x, mouseVector.y, this));
    }

    private _onMouseUp(event: MouseEvent) : void {
        const mouseVector = this._render.creator.Vector(event.clientX, event.clientY);
        this._dragging = false;
        this._dragStart = null;
        this.emit("dragend", this._constructArgs(event.clientX, event.clientY, mouseVector.x, mouseVector.y, this));
        this._render._dragTarget(null);
    }

    public _isClicked() : boolean {
        const mouseVector = this._render.mousePositionRelative();
        
        return mouseVector.x >= this.position.x && 
               mouseVector.x <= this.position.x + this.width &&
               mouseVector.y >= this.position.y && 
               mouseVector.y <= this.position.y + this.height;
    }

    public drawMask() : void {
        this._ctx.rect(this.position.x, this.position.y, this.width, this.height);
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