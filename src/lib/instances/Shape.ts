import { v4 as uuidv4 } from 'uuid';
import { Vector } from "../common/Vector";
import { Render } from "../Render";
import { BodyVelocity } from "../common/BodyVelocity";
import { ShapeManager } from "../managers/Shape.manager";

export interface ShapeProps {
    position: Vector;
}

export abstract class Shape {
    protected _render: Render;
    private _id: string;
    public position: Vector;
    public bodyVelocity: BodyVelocity | null = null;

    public manager: ShapeManager;

    public constructor(props: ShapeProps, render: Render) {
        this.position = props.position ?? new Vector(0, 0);
        this._id = uuidv4();
        this.manager = new ShapeManager(this);

        this._render = render;
        this._render.manager.addChild(this);
    }

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

    public destroy() : void {
        this._render.manager.removeChild(this);
    }
}