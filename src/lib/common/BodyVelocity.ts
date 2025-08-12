import { Shape } from "../instances/Shape";
import { Vector } from "./Vector";

export interface BodyVelocityProps {
    shape: Shape;
    direction: Vector;
    speed: number;
}

export class BodyVelocity {
    private _shape: Shape;
    public direction: Vector;
    public speed: number;

    public constructor(props: BodyVelocityProps) {
        this._shape = props.shape;
        this.direction = props.direction ?? new Vector(0, 0);
        this.speed = props.speed ?? 0;
    }

    public update() : void {
        this._shape.position.x += this.direction.x * this.speed;
        this._shape.position.y += this.direction.y * this.speed;
    }
}