import { Vector } from "./common/Vector";
import { RenderCreator } from "./helpers/Render.creator";
import { RenderEvents, RenderEventsProps, RenderEventsType } from "./helpers/Render.events";
import { Shape } from "./instances/Shape";
import { RenderManager } from "./managers/Render.manager";
import { Transformer } from "./common/Transformer";
import { Rect } from "./instances/_shapes/Rect";

export class Render {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    public childrens: Map<string, Shape> = new Map();
    public _transformer: Transformer | null = null;

    private _mouseVector: Vector = new Vector(0, 0);
    private _target: Shape | this = this;
    private _events: RenderEvents;
    private _frameId: number | null = null;
    private _resizeBind: () => void = this.resize.bind(this);
    private _renderBind: () => void = this.render.bind(this);
    private _onClickedBind: (event: MouseEvent) => void = this._onClicked.bind(this);
    private _onMouseMoveBind: (event: MouseEvent) => void = this._onMouseMove.bind(this);
    private _onMouseDownBind: (event: MouseEvent) => void = this._onMouseDown.bind(this);
    private _onMouseUpBind: (event: MouseEvent) => void = this._onMouseUp.bind(this);
    
    private _dragging: boolean = false;
    private _dragTarget: Shape | null = null;
    private _dragStart: Vector | null = null;

    private _boundary: Rect | null = null;
    private _boundaryStart: Vector | null = null;
    private _isSelecting: boolean = false;

    private _fps: number = 0;
    private _lastFrameTime: number = performance.now();
    private _frameCount: number = 0;
    
    public creator: RenderCreator;
    public manager: RenderManager;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;
        this.creator = new RenderCreator(this);
        this.manager = new RenderManager(this);
        this._events = new RenderEvents();

        this.setup();
    }

    private setup() : void {
        this.config();
        this.events();
    }

    private config() : void {
        this.resize();
        this.boundary();
    }

    private boundary(): void {
        this.on("mousedown", (args) => {
            if (args.target === this) {
                this._isSelecting = true;
                this._boundaryStart = args.pointer.relative;
                
                this._boundary = this.creator.Rect({
                    position: this.creator.Vector(args.pointer.relative.x, args.pointer.relative.y),
                    width: 0,
                    height: 0,
                    color: "rgba(0, 123, 255, 0.2)",
                    zIndex: 1000
                });
                
                this._boundary.mask = false;
                this._boundary.dragging = false;
            }
        });

        this.on("mousemove", (args) => {
            if (!this._isSelecting || !this._boundaryStart || !this._boundary) return;

            const startX = this._boundaryStart.x;
            const startY = this._boundaryStart.y;
            const currentX = args.pointer.relative.x;
            const currentY = args.pointer.relative.y;

            const x = Math.min(startX, currentX);
            const y = Math.min(startY, currentY);
            const width = Math.abs(currentX - startX);
            const height = Math.abs(currentY - startY);

            this._boundary.position.x = x;
            this._boundary.position.y = y;
            this._boundary.width = width;
            this._boundary.height = height;
        });

        this.on("mouseup", () => {
            if (!this._isSelecting || !this._boundary || !this._transformer) return;

            const selectedNodes = this._getNodesInBoundary();
            
            if (selectedNodes.length > 0) {
                this._transformer?.clear();
                
                selectedNodes.forEach(node => {
                    this._transformer?.add(node);
                });

                console.log(selectedNodes);
                console.log(this._transformer);
            }

            if (this._boundary) {
                this._boundary.destroy();
                this._boundary = null;
            }
            
            this._isSelecting = false;
            this._boundaryStart = null;
        });
    }

    private _getNodesInBoundary(): Shape[] {
        if (!this._boundary) return [];

        const boundaryX = this._boundary.position.x;
        const boundaryY = this._boundary.position.y;
        const boundaryWidth = this._boundary.width;
        const boundaryHeight = this._boundary.height;

        return [...this.childrens.values()].filter(shape => {
            if (shape === this._boundary) return false;

            return this._isShapeInBoundary(shape, boundaryX, boundaryY, boundaryWidth, boundaryHeight);
        });
    }

    private _isShapeInBoundary(shape: Shape, boundaryX: number, boundaryY: number, boundaryWidth: number, boundaryHeight: number): boolean {
        let shapeX = shape.position.x;
        let shapeY = shape.position.y;
        let shapeWidth = 0;
        let shapeHeight = 0;

        if (shape instanceof Rect) {
            shapeWidth = shape.width;
            shapeHeight = shape.height;
        } else if (shape.constructor.name === 'Circle') {
            const circle = shape as any;
            shapeX = circle.position.x - circle.radius;
            shapeY = circle.position.y - circle.radius;
            shapeWidth = circle.radius * 2;
            shapeHeight = circle.radius * 2;
        } else if (shape.constructor.name === 'Sprite') {
            const sprite = shape as any;
            shapeWidth = sprite.getWidth();
            shapeHeight = sprite.getHeight();
        }

        return !(shapeX + shapeWidth < boundaryX || 
                 shapeX > boundaryX + boundaryWidth ||
                 shapeY + shapeHeight < boundaryY || 
                 shapeY > boundaryY + boundaryHeight);
    }

    private resize(): void {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    private events() : void {
        window.addEventListener("resize", this._resizeBind);
        window.addEventListener("click", this._onClickedBind);
        window.addEventListener("mousemove", this._onMouseMoveBind);
        window.addEventListener("mousedown", this._onMouseDownBind);
        window.addEventListener("mouseup", this._onMouseUpBind);
    }

    private _onMouseMove(event: MouseEvent) : void {
        const { clientX, clientY } = event;
        const { left, top } = this.canvas.getBoundingClientRect();
        this._mouseVector = this.creator.Vector(clientX - left, clientY - top);
        
        if (this._dragging && this._dragTarget && this._dragStart) {
            const mouseVector = this.creator.Vector(clientX - left, clientY - top);
            this._dragTarget.position = mouseVector.sub(this._dragStart);
            
            const args = {
                pointer: {
                    absolute: this.creator.Vector(clientX, clientY),
                    relative: mouseVector
                },
                target: this._dragTarget
            };
            
            this._dragTarget.emit("drag", args);
        }

        this._events.emit("mousemove", { pointer: { absolute: this.creator.Vector(clientX, clientY), relative: this.creator.Vector(clientX - left, clientY - top) }, target: this._target });
    }

    private _onClicked(event: MouseEvent) : void {
        const { clientX, clientY } = event;
        const { left, top, width, height } = this.canvas.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;

        if (x < 0 || x > width || y < 0 || y > height) return;

        this._target = [...this.childrens.values()].sort((a, b) => b.zIndex - a.zIndex)
            .find((child) => child._isClicked()) ?? this;

        this._events.emit("click", { pointer: { absolute: this.creator.Vector(clientX, clientY), relative: this.creator.Vector(x, y) }, target: this._target });
        
        if (this._target instanceof Shape) {
            this._target.emit("click", { pointer: { absolute: this.creator.Vector(clientX, clientY), relative: this.creator.Vector(x, y) }, target: this._target });
        }
    }
    
    private _onMouseDown(event: MouseEvent) : void {
        const { clientX, clientY } = event;
        const { left, top, width, height } = this.canvas.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;

        if (x < 0 || x > width || y < 0 || y > height) return;

        const draggableTarget = [...this.childrens.values()]
            .filter(child => child.dragging)
            .sort((a, b) => b.zIndex - a.zIndex)
            .find((child) => child._isClicked());
            
        if (draggableTarget) {
            this._dragging = true;
            this._dragTarget = draggableTarget;
            const mouseVector = this.creator.Vector(x, y);
            this._dragStart = mouseVector.sub(draggableTarget.position);
            
            const args = {
                pointer: {
                    absolute: this.creator.Vector(clientX, clientY),
                    relative: mouseVector
                },
                target: draggableTarget
            };
            
            draggableTarget.emit("dragstart", args);
        }

        this._events.emit("mousedown", { pointer: { absolute: this.creator.Vector(clientX, clientY), relative: this.creator.Vector(x, y) }, target: draggableTarget ?? this });
    }
    
    private _onMouseUp(event: MouseEvent) : void {
        if (this._dragging && this._dragTarget) {
            const { clientX, clientY } = event;
            const { left, top } = this.canvas.getBoundingClientRect();
            
            const args = {
                pointer: {
                    absolute: this.creator.Vector(clientX, clientY),
                    relative: this.creator.Vector(clientX - left, clientY - top)
                },
                target: this._dragTarget
            };
            
            this._dragTarget.emit("dragend", args);
        }
        
        this._dragging = false;
        this._dragTarget = null;
        this._dragStart = null;

        const { clientX, clientY } = event;
        const { left, top } = this.canvas.getBoundingClientRect();
        
        this._events.emit("mouseup", { pointer: { absolute: this.creator.Vector(clientX, clientY), relative: this.creator.Vector(clientX - left, clientY - top) }, target: this._target ?? this });
    }

    private _updateFps() : void {
        const now = performance.now();
        const deltaTime = (now - this._lastFrameTime) / 1000;
        this._frameCount++;

        if (deltaTime >= 1) {
            this._fps = this._frameCount / deltaTime;
            this._frameCount = 0;   
            this._lastFrameTime = now;
        }
    }

    private _showFps() : void {
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(`FPS: ${this._fps.toFixed(2)}`, 10, this.canvas.height - 10);
    }

    private clear() : void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private render(): void {
        this.clear();

        const shapes = [...this.childrens.values()].sort((a, b) => a.zIndex - b.zIndex);
        const normalShapes = shapes.filter(shape => !shape.mask);
        const maskShapes = shapes.filter(shape => shape.mask);

        normalShapes.forEach((shape) => {
            const affectingMasks = maskShapes.filter(mask => mask.zIndex > shape.zIndex);
            
            if (affectingMasks.length > 0) {
                this.ctx.save();
                
                shape.update();
                
                this.ctx.globalCompositeOperation = 'destination-out';
                affectingMasks.forEach(mask => {
                    this.ctx.beginPath();
                    mask._mask();
                    this.ctx.fill();
                });
                
                this.ctx.restore();
            } else {
                shape.update();
            }
        });

        this._transformer?.update();

        this._updateFps();
        this._showFps();
        this._frameId = requestAnimationFrame(this._renderBind);
    }

    public mousePositionAbsolute() : Vector {
        const { left, top } = this.canvas.getBoundingClientRect();
        return this.creator.Vector(this._mouseVector.x + left, this._mouseVector.y + top);
    }

    public mousePositionRelative() : Vector {
        return this._mouseVector;
    }

    public on(event: RenderEventsType, callback: (args: RenderEventsProps) => void) : void {
        this._events.on(event, callback);
    }

    public off(event: RenderEventsType, callback: (args: RenderEventsProps) => void) : void {
        this._events.off(event, callback);
    }

    public start() : void {
        if (this._frameId) return;
        this._frameId = requestAnimationFrame(this._renderBind);
    }

    public stop() : void {
        if (this._frameId) {
            cancelAnimationFrame(this._frameId);
            this._frameId = null;
        }
    }

    public destroy() : void {
        this.stop();
        window.removeEventListener("resize", this._resizeBind);
        window.removeEventListener("click", this._onClickedBind);
        window.removeEventListener("mousemove", this._onMouseMoveBind);
        window.removeEventListener("mousedown", this._onMouseDownBind);
        window.removeEventListener("mouseup", this._onMouseUpBind);
    }
}