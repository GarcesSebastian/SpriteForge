import { Shape } from "../instances/Shape";
import { BodyVelocity } from "../common/BodyVelocity";
import { Vector } from "../common/Vector";

export class ShapeManager {
    private _shape: Shape;

    public constructor(shape: Shape) {
        this._shape = shape;
    }

    public bodyVelocity(direction: Vector, speed: number): void {
        if (this._shape.bodyVelocity) return;
        this._shape.bodyVelocity = new BodyVelocity({
            direction: direction,
            speed: speed,
            shape: this._shape
        });
    }
}