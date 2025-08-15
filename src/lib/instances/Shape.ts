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

    /**
     * Creates a new shape instance with common properties and behavior
     * @param props - Configuration properties for the shape
     * @param render - Render context for drawing operations
     */
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

    /**
     * Abstract method to determine if the shape is being clicked
     * Must be implemented by concrete shape classes
     * @returns True if shape is clicked, false otherwise
     */
    public abstract _isClicked() : boolean;
    /**
     * Abstract method to check if shape intersects with a boundary
     * Must be implemented by concrete shape classes
     * @param boundaryX - X coordinate of the boundary
     * @param boundaryY - Y coordinate of the boundary
     * @param boundaryWidth - Width of the boundary
     * @param boundaryHeight - Height of the boundary
     * @returns True if shape intersects boundary, false otherwise
     */
    public abstract _isShapeInBoundary(boundaryX: number, boundaryY: number, boundaryWidth: number, boundaryHeight: number): boolean;
    /**
     * Abstract method to create a clipping mask for the shape
     * Must be implemented by concrete shape classes
     */
    public abstract _mask() : void;

    /**
     * Gets the unique identifier for this shape
     * @returns The UUID string identifier
     */
    public get id() : string {
        return this._id;
    }

    /**
     * Gets the render context associated with this shape
     * @returns The Render instance used for drawing operations
     */
    public get render() : Render {
        return this._render;
    }

    /**
     * Base draw method that throws an error if not overridden
     * Concrete shape classes must implement their own draw logic
     * @throws Error when called without being overridden
     */
    public draw() : void {
        throw new Error("Method not implemented.");
    }

    /**
     * Updates the shape's state and physics
     * Handles body velocity updates if physics is enabled
     */
    public update() : void {
        if (this.bodyVelocity) this.bodyVelocity.update();
    }

    /**
     * Abstract method to create a copy of the shape
     * Must be implemented by concrete shape classes
     * @returns A new Shape instance with identical properties
     */
    public abstract clone() : Shape;

    /**
     * Destroys the shape and cleans up resources
     * Emits destroy event, removes from render manager, and cleans up transformer
     */
    public destroy() : void {
        this.emit("destroy");
        this._render.manager.removeChild(this);
        
        if (this._transformer && this._transformer.hasNode(this)) {
            this._transformer.remove(this);
        }
    }
}