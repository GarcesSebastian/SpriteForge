import { Vector } from "./common/Vector";
import { RenderCreator } from "./helpers/Render.creator";
import { RenderEvents, RenderEventsProps, RenderEventsType } from "./helpers/Render.events";
import { Shape } from "./instances/Shape";
import { RenderManager } from "./managers/Render.manager";

export class Render {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    public childrens: Map<string, Shape> = new Map();

    private _draget: Shape | null = null;
    private _mouseVector: Vector = new Vector(0, 0);
    private _target: Shape | null = null;
    private _events: RenderEvents;
    private _frameId: number | null = null;
    private _resizeBind: () => void = this.resize.bind(this);
    private _renderBind: () => void = this.render.bind(this);
    private _onClickedBind: (event: MouseEvent) => void = this._onClicked.bind(this);
    private _onMouseMoveBind: (event: MouseEvent) => void = this._onMouseMove.bind(this);
    
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
    }

    private _onMouseMove(event: MouseEvent) : void {
        const { clientX, clientY } = event;
        const { left, top } = this.canvas.getBoundingClientRect();
        this._mouseVector = this.creator.Vector(clientX - left, clientY - top);
    }

    private _onClicked(event: MouseEvent) : void {
        const { clientX, clientY } = event;
        const { left, top, width, height } = this.canvas.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;

        if (x < 0 || x > width || y < 0 || y > height) return;

        const childrensFormatted: Shape[] = [...this.childrens.values()].sort((a, b) => a.zIndex - b.zIndex);
        childrensFormatted.forEach((child) => {
            if (child._isClicked()) {
                this._target = child;
                return;
            }
        });

        if (!this._target) {
            this._target = this as unknown as Shape;
        }

        this._events.emit("click", { pointer: { absolute: this.creator.Vector(clientX, clientY), relative: this.creator.Vector(x, y) }, target: this._target });
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
                    mask.drawMask();
                    this.ctx.fill();
                });
                
                this.ctx.restore();
            } else {
                shape.update();
            }
        });

        this._frameId = requestAnimationFrame(this._renderBind);
    }

    public _dragTarget(shape: Shape | null) : void {
        this._draget = shape;
    }

    public _isDragTarget(shape: Shape) : boolean {
        return this._draget === shape || this._draget === null;
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
    }
}