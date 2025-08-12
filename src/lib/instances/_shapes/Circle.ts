import { Shape, ShapeProps } from "../Shape";
import { Render } from "../../Render";
import { RenderEventsType, RenderEventsProps } from "@/lib/helpers/Render.events";
import { Vector } from "@/lib/common/Vector";

export interface CircleProps extends ShapeProps {
    radius: number;
    color?: string;
}

export class Circle extends Shape {
    private _ctx: CanvasRenderingContext2D;

    public radius: number;
    public color: string;

    private _dragging: boolean = false;
    private _dragStart: Vector | null = null;

    private _onClickedBind: (event: MouseEvent) => void = this._onClicked.bind(this);
    private _onMouseDownBind: (event: MouseEvent) => void = this._onMouseDown.bind(this);
    private _onMouseMoveBind: (event: MouseEvent) => void = this._onMouseMove.bind(this);
    private _onMouseUpBind: (event: MouseEvent) => void = this._onMouseUp.bind(this);

    public constructor(props: CircleProps, render: Render) {
        super(props, render);
        this._ctx = render.ctx;
        this.radius = props.radius ?? 10;
        this.color = props.color ?? "#fff";

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

    private _onMouseDown(event: MouseEvent) : void {
        if (!this.dragging) return;
        if (!this._render._isDragTarget(this)) return;

        const { clientX, clientY } = event;
        const { left, top } = this._render.canvas.getBoundingClientRect();

        const mouseVector = this._render.creator.Vector(clientX - left, clientY - top);
        
        if (!this._isClicked()) return;
        
        this._render._dragTarget(this);
        this._dragging = true;
        this._dragStart = mouseVector.sub(this.position);
        this.emit("dragstart", this._constructArgs(clientX, clientY, mouseVector.x, mouseVector.y, this));
    }

    private _onMouseMove(event: MouseEvent) : void {
        if (!this.dragging) return;
        if (!this._dragging) return;
        
        const { clientX, clientY } = event;
        const { left, top } = this._render.canvas.getBoundingClientRect();

        const mouseVector = this._render.creator.Vector(clientX - left, clientY - top);
        this.position = mouseVector.sub(this._dragStart!);
        this.emit("drag", this._constructArgs(clientX, clientY, mouseVector.x, mouseVector.y, this));
    }

    private _onMouseUp(event: MouseEvent) : void {
        if (!this.dragging) return;
        this._dragging = false;
        this._dragStart = null;
        this.emit("dragend", this._constructArgs(event.clientX, event.clientY, event.clientX, event.clientY, this));
        this._render._dragTarget(null);
    }

    public on(event: RenderEventsType, callback: (args: RenderEventsProps) => void) : void {
        this._events.on(event, callback);
    }

    public off(event: RenderEventsType, callback: (args: RenderEventsProps) => void) : void {
        this._events.off(event, callback);
    }

    public draw() : void {
        this._ctx.beginPath();
        this._ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this._ctx.fillStyle = this.color;
        this._ctx.fill();
        this._ctx.closePath();
    }

    public drawMask() : void {
        this._ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    }

    public update() : void {
        super.update();
        this.draw();
    }

    public _isClicked() : boolean {
        const mouseVector = this._render.mousePositionRelative();
        const distance = mouseVector.sub(this.position).len();
        
        return distance <= this.radius;
    }

    private _onClicked(event: MouseEvent) : void {
        const { clientX, clientY } = event;
        const { left, top } = this._render.canvas.getBoundingClientRect();

        const mouseVector = this._render.creator.Vector(clientX - left, clientY - top);
        const distance = mouseVector.sub(this.position).len();
        
        if (distance <= this.radius) {
            this.emit("click", this._constructArgs(clientX, clientY, mouseVector.x, mouseVector.y, this));
        }
    }
}