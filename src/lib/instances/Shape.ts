import { v4 as uuidv4 } from 'uuid';
import { Vector } from "../common/Vector";
import { Render } from "../Render";
import { BodyVelocity } from "../common/BodyVelocity";
import { ShapeManager } from "../managers/Shape.manager";
import { Transformer } from "../common/Transformer";
import { ShapeProvider } from "../providers/Shape.provider";

export interface ShapeProps {
    dragging?: boolean;
    position: Vector;
    zIndex?: number;
    mask?: boolean;
    rotation?: number;
    visible?: boolean;
}

export abstract class Shape extends ShapeProvider {
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
    public _transformer: Transformer | null = null;

    public constructor(props: ShapeProps, render: Render) {
        super();
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

    public draw() : void {
        throw new Error("Method not implemented.");
    }

    public update() : void {
        if (this.bodyVelocity) this.bodyVelocity.update();
    }

    public abstract clone() : Shape;

    public destroy() : void {
        this.emit("destroy");
        this._render.manager.removeChild(this);
        
        if (this._transformer && this._transformer.hasNode(this)) {
            this._transformer.remove(this);
        }
    }
}