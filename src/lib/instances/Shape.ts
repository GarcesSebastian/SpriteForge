import { v4 as uuidv4 } from 'uuid';
import { Vector } from "../common/Vector";
import { Render } from "../Render";
import { RenderEvents, RenderEventsProps, RenderEventsType } from "../helpers/Render.events";
import { BodyVelocity } from "../common/BodyVelocity";
import { ShapeManager } from "../managers/Shape.manager";

export interface ShapeProps {
    dragging?: boolean;
    position: Vector;
    zIndex?: number;
    mask?: boolean;
    rotation?: number;
    visible?: boolean;
}

export abstract class Shape {
    protected _events: RenderEvents;
    protected _render: Render;
    private _id: string;
    
    public position: Vector;
    public bodyVelocity: BodyVelocity | null = null;
    public zIndex: number;
    public mask: boolean;
    public rotation: number;
    public dragging: boolean;
    public visible: boolean;
    
    public manager: ShapeManager;

    public constructor(props: ShapeProps, render: Render) {
        this.position = props.position ?? new Vector(0, 0);
        this.zIndex = props.zIndex ?? 0;
        this.mask = props.mask ?? false;
        this.rotation = props.rotation ?? 0;
        this._id = uuidv4();
        this.manager = new ShapeManager(this);
        this.dragging = props.dragging ?? false;
        this.visible = props.visible ?? true;

        this._render = render;
        this._render.manager.addChild(this);
        this._events = new RenderEvents();
    }

    public abstract _isClicked() : boolean;
    public abstract _isShapeInBoundary(boundaryX: number, boundaryY: number, boundaryWidth: number, boundaryHeight: number): boolean;
    public abstract _mask() : void;

    public get id() : string {
        return this._id;
    }

    public get render() : Render {
        return this._render;
    }

    public on(event: RenderEventsType, callback: (args: RenderEventsProps) => void) : Shape {
        this._events.on(event, callback);
        return this;
    }

    public off(event: RenderEventsType, callback: (args: RenderEventsProps) => void) : Shape {
        this._events.off(event, callback);
        return this;
    }

    public emit(event: RenderEventsType, args: RenderEventsProps) : Shape {
        this._events.emit(event, args);
        return this;
    }

    public draw() : void {
        throw new Error("Method not implemented.");
    }

    public update() : void {
        if (this.bodyVelocity) this.bodyVelocity.update();
    }

    public destroy() : void {
        this._render.manager.removeChild(this);
    }
}