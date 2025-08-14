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

    private _isResizing: boolean = false;
    private _resizeStart: Vector | null = null;
    private _resizeHandle: TransformerBounds | null = null;
    private _initialDimensions: { width: number, height: number, x: number, y: number } | null = null;
    private _initialNodeStates: Array<{
        position: Vector,
        width?: number,
        height?: number,
        radius?: number,
        scale?: number
    }> = [];

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
        console.log(args.target);
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
        const clickedHandle = this._getClickedHandle();
        if (clickedHandle) {
            this._isResizing = true;
            this._resizeStart = args.pointer.relative;
            this._resizeHandle = clickedHandle;
            this._initialDimensions = this._dimension();
            this._saveInitialNodeStates();
            this._render._cancelSelect();
            return;
        }

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

        if (this._isClicked() && !this._isResizing) {
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

            this._render._cancelSelect();
            this._events.emit("trmove", { pointer: { absolute: this._render.mousePositionAbsolute(), relative: this._render.mousePositionRelative() }, target: this._render });
        }

        if (this._isResizing && this._resizeHandle && this._initialDimensions) {
            this._performResize(args.pointer.relative);
        }
    }

    private _onMouseUpTr(): void {
        if (this._isDragging) {
            this._isDragging = false;
            this._dragStart = null;
            this._justFinishedDrag = true;
            this._render._enableSelect();
        }

        if (this._isResizing) {
            this._isResizing = false;
            this._resizeStart = null;
            this._resizeHandle = null;
            this._initialDimensions = null;
            this._initialNodeStates = [];
            this._render._enableSelect();
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

    private _getClickedHandle(): TransformerBounds | null {
        const mouseVector = this._render.mousePositionRelative();
        const { x, y, width, height } = this._dimension();
        
        const transformerX = x - this.padding;
        const transformerY = y - this.padding;
        const transformerWidth = width + this.padding * 2;
        const transformerHeight = height + this.padding * 2;
        
        const radius = 10;
        
        for (const [key, boundary] of Object.entries(this._boundarys)) {
            const rx = transformerX + boundary.x * transformerWidth - radius / 2;
            const ry = transformerY + boundary.y * transformerHeight - radius / 2;
            
            if (mouseVector.x >= rx && 
                mouseVector.x <= rx + radius && 
                mouseVector.y >= ry && 
                mouseVector.y <= ry + radius) {
                return key as TransformerBounds;
            }
        }
        
        return null;
    }

    private _saveInitialNodeStates(): void {
        this._initialNodeStates = this._nodes.map(node => {
            const state: any = {
                position: new Vector(node.position.x, node.position.y)
            };

            if (node instanceof Rect) {
                state.width = node.width;
                state.height = node.height;
            } else if (node instanceof Circle) {
                state.radius = node.radius;
            } else if (node instanceof Sprite) {
                state.scale = node.scale || 1;
            }

            return state;
        });
    }

    private _performResize(currentMouse: Vector): void {
        if (!this._resizeStart || !this._resizeHandle || !this._initialDimensions || this._initialNodeStates.length === 0) return;

        const delta = currentMouse.sub(this._resizeStart);
        const { x: initialX, y: initialY, width: initialWidth, height: initialHeight } = this._initialDimensions;

        let newX = initialX;
        let newY = initialY;
        let newWidth = initialWidth;
        let newHeight = initialHeight;

        switch (this._resizeHandle) {
            case "top-left":
                newX = initialX + delta.x;
                newY = initialY + delta.y;
                newWidth = initialWidth - delta.x;
                newHeight = initialHeight - delta.y;
                break;
            case "top-right":
                newY = initialY + delta.y;
                newWidth = initialWidth + delta.x;
                newHeight = initialHeight - delta.y;
                break;
            case "bottom-left":
                newX = initialX + delta.x;
                newWidth = initialWidth - delta.x;
                newHeight = initialHeight + delta.y;
                break;
            case "bottom-right":
                newWidth = initialWidth + delta.x;
                newHeight = initialHeight + delta.y;
                break;
        }

        if (newWidth < 20 || newHeight < 20) return;

        const scaleX = newWidth / initialWidth;
        const scaleY = newHeight / initialHeight;

        this._nodes.forEach((node, index) => {
            const initialState = this._initialNodeStates[index];
            if (!initialState) return;

            const relativeX = (initialState.position.x - initialX) / initialWidth;
            const relativeY = (initialState.position.y - initialY) / initialHeight;

            node.position.x = newX + relativeX * newWidth;
            node.position.y = newY + relativeY * newHeight;

            if (node instanceof Rect && initialState.width !== undefined && initialState.height !== undefined) {
                const nodeRelativeWidth = initialState.width / initialWidth;
                const nodeRelativeHeight = initialState.height / initialHeight;
                node.width = nodeRelativeWidth * newWidth;
                node.height = nodeRelativeHeight * newHeight;
            } else if (node instanceof Circle && initialState.radius !== undefined) {
                const nodeRelativeRadius = initialState.radius / Math.min(initialWidth, initialHeight);
                node.radius = nodeRelativeRadius * Math.min(newWidth, newHeight);
            } else if (node instanceof Sprite && initialState.scale !== undefined) {
                node.scale = initialState.scale * Math.min(scaleX, scaleY);
            }
        });
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
        
        return isInTransformerArea;
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