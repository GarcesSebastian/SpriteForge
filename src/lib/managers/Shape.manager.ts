import { Shape } from "../instances/Shape";
import { BodyVelocity } from "../common/BodyVelocity";
import { Vector } from "../common/Vector";

/**
 * Manager class for handling shape-specific operations and physics
 * Provides utilities for adding physics components like velocity to shapes
 */
export class ShapeManager {
    private _shape: Shape;

    /**
     * Creates a new shape manager for the given shape
     * @param shape - The shape instance to manage
     */
    public constructor(shape: Shape) {
        this._shape = shape;
    }

    /**
     * Adds velocity-based physics to the shape
     * @param direction - The direction vector for movement
     * @param speed - The speed multiplier for movement
     */
    public bodyVelocity(direction: Vector, speed: number): void {
        if (this._shape.bodyVelocity) return;
        this._shape.bodyVelocity = new BodyVelocity({
            direction: direction,
            speed: speed,
            shape: this._shape
        });
    }
}