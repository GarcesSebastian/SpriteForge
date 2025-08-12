import { RenderCreator } from "./helpers/Render.creator";
import { Shape } from "./instances/Shape";
import { RenderManager } from "./managers/Render.manager";

export class Render {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    public childrens: Map<string, Shape> = new Map();

    private _frameId: number | null = null;
    private _resizeBind: () => void = this.resize.bind(this);
    private _renderBind: () => void = this.render.bind(this);
    
    public creator: RenderCreator;
    public manager: RenderManager;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;
        this.creator = new RenderCreator(this);
        this.manager = new RenderManager(this);

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
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private events() : void {
        window.addEventListener("resize", this._resizeBind);
    }

    private clear() : void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private render(): void {
        this.clear();

        this.childrens.forEach((child) => {
            child.update();
        });

        this._frameId = requestAnimationFrame(this._renderBind);
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
    }
}