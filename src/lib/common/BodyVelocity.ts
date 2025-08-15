import { Shape } from "../instances/Shape";
import { Vector } from "./Vector";

export interface BodyVelocityProps {
    shape: Shape;
    direction: Vector;
    speed: number;
}

export class BodyVelocity {
    private _shape: Shape | null;
    public direction: Vector | null;
    public speed: number | null;

    public constructor(props: BodyVelocityProps) {
        this._shape = props.shape ?? null;
        this.direction = props.direction ?? null;
        this.speed = props.speed ?? null;
    }

    public update() : void {
        if (!this._shape || !this.direction || !this.speed) return;
        this._shape.position.x += this.direction.x * this.speed;
        this._shape.position.y += this.direction.y * this.speed;
    }

    public destroy() : void {
        if (!this._shape) return;
        this._shape.bodyVelocity = null;
        this._shape = null;
        this.direction = null;
        this.speed = null;
    }
}