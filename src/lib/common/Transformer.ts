import { Render } from "../Render";
import { RenderEvents, RenderEventsProps } from "../helpers/Render.events";
import { Shape } from "../instances/Shape";
import { Circle } from "../instances/_shapes/Circle";
import { Rect } from "../instances/_shapes/Rect";
import { Sprite } from "../instances/_shapes/Sprite";
import { v4 as uuidv4 } from "uuid";
import { Vector } from "./Vector";

export type TransformerBounds = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export class Transformer {
    private _ctx: CanvasRenderingContext2D;
    private _render: Render;
    private _id: string;
    private _events: RenderEvents;

    private _isDragging: boolean = false;
    private _dragStart: Vector | null = null;
    private _shifted: boolean = false;
    private _justFinishedDrag: boolean = false;

    private _nodes: Shape[] = [];
    private _boundarys: Record<TransformerBounds, Vector> = {
        "top-left": new Vector(0, 0),
        "top-right": new Vector(1, 0),
        "bottom-left": new Vector(0, 1),
        "bottom-right": new Vector(1, 1)
    };

    public padding: number = 10;

    public constructor(ctx: CanvasRenderingContext2D, render: Render) {
        this._ctx = ctx;
        this._render = render;
        this._id = uuidv4();
        this._render.manager.addTransformer(this);
        this._events = new RenderEvents();

        this.events();
    }

    private events(): void {
        this._render.on("click", this._onClickedTr.bind(this));
        this._render.on("mousedown", this._onMouseDownTr.bind(this));
        this._render.on("mousemove", this._onMouseMoveTr.bind(this));
        this._render.on("mouseup", this._onMouseUpTr.bind(this));

        window.addEventListener("keydown", this._onKeyDown.bind(this));
        window.addEventListener("keyup", this._onKeyUp.bind(this));
    }

    private _onClickedTr(args: RenderEventsProps): void {
        if (this._justFinishedDrag) {
            this._justFinishedDrag = false;
            return;
        }

        if (args.target instanceof Render) {
            this.clear();
        }

        if (this._render._selectedNodes.length > 0) {
            this.clear();
            this.list([...this._render._selectedNodes]);
            this._render._selectedNodes = [];
        }

        if (args.target instanceof Shape) {
            if (!this._shifted) {
                this.clear();
            }

            this.add(args.target);
        }
    }

    private _onMouseDownTr(args: RenderEventsProps): void {
        if (args.target instanceof Shape) {
            const targetShape = args.target as Shape;
            const isNodeInTransformer = this._nodes.some(node => node.id === targetShape.id);
            
            if (!this._shifted && !isNodeInTransformer) {
                this.clear();
            }

            if (!isNodeInTransformer) {
                this.add(targetShape);
            }
            
            if (isNodeInTransformer || this._nodes.length > 0) {
                this._isDragging = true;
                this._dragStart = args.pointer.relative;
            }
        }

        if (args.target instanceof Transformer) {
            this._isDragging = true;
            this._dragStart = args.pointer.relative;
        }
    }

    private _onMouseMoveTr(args: RenderEventsProps): void {
        if (this._isDragging) {
            const mouseVector = args.pointer.relative;
            const delta = mouseVector.sub(this._dragStart!);
            this._dragStart = mouseVector;

            this._nodes.forEach(node => {
                node.position.x += delta.x;
                node.position.y += delta.y;
            });

            this._events.emit("trmove", { pointer: { absolute: this._render.mousePositionAbsolute(), relative: this._render.mousePositionRelative() }, target: this._render });
        }
    }

    private _onMouseUpTr(): void {
        if (this._isDragging) {
            this._isDragging = false;
            this._dragStart = null;
            this._justFinishedDrag = true;
        }
    }

    private _onKeyDown(e: KeyboardEvent): void {
        if (e.key === "Shift") {
            this._shifted = true;
        }
    }

    private _onKeyUp(e: KeyboardEvent): void {
        if (e.key === "Shift") {
            this._shifted = false;
        }
    }

    public _isClicked(): boolean {
        const mouseVector = this._render.mousePositionRelative();
        const { x, y, width, height } = this._dimension();
        
        const transformerX = x - this.padding;
        const transformerY = y - this.padding;
        const transformerWidth = width + this.padding * 2;
        const transformerHeight = height + this.padding * 2;
        
        const isInTransformerArea = mouseVector.x >= transformerX && 
                                   mouseVector.x <= transformerX + transformerWidth && 
                                   mouseVector.y >= transformerY && 
                                   mouseVector.y <= transformerY + transformerHeight;
        
        const radius = 10;
        const isInBoundary = Object.values(this._boundarys).some(boundary => {
            const rx = transformerX + boundary.x * transformerWidth - radius / 2;
            const ry = transformerY + boundary.y * transformerHeight - radius / 2;
            
            return mouseVector.x >= rx && 
                   mouseVector.x <= rx + radius && 
                   mouseVector.y >= ry && 
                   mouseVector.y <= ry + radius;
        });
        
        return isInTransformerArea || isInBoundary;
    }

    private _dimension(): { width: number, height: number, x: number, y: number } {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        this._nodes.forEach(node => {
            if (node instanceof Rect) {
                minX = Math.min(minX, node.position.x);
                minY = Math.min(minY, node.position.y);
                maxX = Math.max(maxX, node.position.x + node.width);
                maxY = Math.max(maxY, node.position.y + node.height);
            }

            if (node instanceof Circle) {
                minX = Math.min(minX, node.position.x - node.radius);
                minY = Math.min(minY, node.position.y - node.radius);
                maxX = Math.max(maxX, node.position.x + node.radius);
                maxY = Math.max(maxY, node.position.y + node.radius);
            }

            if (node instanceof Sprite) {
                minX = Math.min(minX, node.position.x);
                minY = Math.min(minY, node.position.y);
                maxX = Math.max(maxX, node.position.x + node.getWidth());
                maxY = Math.max(maxY, node.position.y + node.getHeight());
            }
        })

        const width = maxX - minX;
        const height = maxY - minY;

        return { width, height, x: minX, y: minY };
    }

    private _rect(): void {
        const { width, height, x, y } = this._dimension();
        this._ctx.beginPath();
        this._ctx.rect(x - this.padding, y - this.padding, width + this.padding * 2, height + this.padding * 2);
        this._ctx.strokeStyle = "red";
        this._ctx.lineWidth = 2;
        this._ctx.stroke();
    }

    private _bounds(): void {
        const { width, height, x, y } = this._dimension();
        const radius = 10;
        
        const transformerX = x - this.padding;
        const transformerY = y - this.padding;
        const transformerWidth = width + this.padding * 2;
        const transformerHeight = height + this.padding * 2;
        
        Object.entries(this._boundarys).forEach(([key]) => {
            const boundary = this._boundarys[key as keyof typeof this._boundarys];
            
            const rx = transformerX + boundary.x * transformerWidth - radius / 2;
            const ry = transformerY + boundary.y * transformerHeight - radius / 2;
            
            this._ctx.beginPath();
            this._ctx.rect(rx, ry, radius, radius);
            this._ctx.fillStyle = "red";
            this._ctx.fill();
            this._ctx.closePath();
        })
    }

    public get id(): string {
        return this._id;
    }

    public get nodes(): Shape[] {
        return this._nodes;
    }

    public add(node: Shape) : Transformer {
        this._nodes.push(node);
        node.dragging = false;
        return this;
    }

    public list(nodes: Shape[]) : Transformer {
        this._nodes = nodes;
        return this;
    }

    public clear() : Transformer {
        this._nodes.forEach(node => node.dragging = true);
        this._nodes = [];
        return this;
    }

    public remove(node: Shape) : Transformer {
        this._nodes = this._nodes.filter(n => n.id !== node.id);
        node.dragging = true;
        return this;
    }

    public update() : void {
        this._rect();
        this._bounds();
    }
}