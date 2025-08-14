import { Render } from "../../Render";
import { Shape, ShapeProps } from "../Shape";

export type SpriteGrid = {
    rows: number,
    cols: number
}

export interface SpriteProps extends ShapeProps {
    src: string;
    spriteGrid: SpriteGrid;
    ignoreFrames?: number[]; 
    startFrame?: number;
    endFrame?: number;
    scale?: number;
    speed?: number;
    loop?: boolean;
}

export class Sprite extends Shape {
    private _ctx: CanvasRenderingContext2D;
    private _image: HTMLImageElement = new Image();
    private _width: number = 100;
    private _height: number = 100;
    private _widthFrame: number = 100;
    private _heightFrame: number = 100;

    private _running: boolean = true;
    private _paused: boolean = false;
    private _debugged: boolean = false;
    private _loading: boolean = true;
    private _frameIndex: number = 0;
    private _frameTime: number = 0;
    private _frameDuration: number = 60;
    
    private static _globalTime: number = 0;
    private static _lastGlobalUpdate: number = performance.now();
    private _lastFrameUpdate: number = 0;
    
    private _debugText: string = "";
    private _debugTextDirty: boolean = true;
    private _lastDebugUpdate: number = 0;

    public src: string;
    public scale: number | undefined;
    public spriteGrid: SpriteGrid;
    public ignoreFrames: number[];
    public startFrame: number;
    public endFrame: number;
    public speed: number | undefined;
    public loop: boolean | undefined;

    public constructor(props: SpriteProps, render: Render) {
        super(props, render);
        this._ctx = render.ctx;
        this.src = props.src;
        this.spriteGrid = props.spriteGrid ?? { rows: 1, cols: 1 };
        this.ignoreFrames = props.ignoreFrames ?? [];
        this.startFrame = props.startFrame ?? 0;
        this.endFrame = props.endFrame ?? this.spriteGrid.rows * this.spriteGrid.cols - 1;
        this.speed = props.speed ?? 1;
        this.loop = props.loop ?? true;

        this.scale = props.scale;

        this._setup();
    }

    private _getWidthFrame() : number {
        return this._widthFrame * (this.scale ?? 1);
    }

    private _getHeightFrame() : number {
        return this._heightFrame * (this.scale ?? 1);
    }

    private _getSpeed() : number {
        return this.speed ?? 1;
    }

    public _isShapeInBoundary(boundaryX: number, boundaryY: number, boundaryWidth: number, boundaryHeight: number): boolean {
        const spriteWidth = this._getWidthFrame();
        const spriteHeight = this._getHeightFrame();

        return !(this.position.x + spriteWidth < boundaryX || 
            this.position.x > boundaryX + boundaryWidth ||
            this.position.y + spriteHeight < boundaryY || 
            this.position.y > boundaryY + boundaryHeight);
    }

    public _isClicked() : boolean {
        const mouseVector = this._render.mousePositionRelative();
        const spriteWidth = this._getWidthFrame();
        const spriteHeight = this._getHeightFrame();
        
        if (this.rotation === 0) {
            return mouseVector.x >= this.position.x && 
                   mouseVector.x <= this.position.x + spriteWidth &&
                   mouseVector.y >= this.position.y && 
                   mouseVector.y <= this.position.y + spriteHeight;
        }
        
        const dx = mouseVector.x - this.position.x;
        const dy = mouseVector.y - this.position.y;
        
        const cos = Math.cos(-this.rotation);
        const sin = Math.sin(-this.rotation);
        
        const localX = dx * cos - dy * sin;
        const localY = dx * sin + dy * cos;
        
        return localX >= 0 && 
               localX <= spriteWidth &&
               localY >= 0 && 
               localY <= spriteHeight;
    }

    public _mask() : void {
        const spriteWidth = this._getWidthFrame();
        const spriteHeight = this._getHeightFrame();
        this._ctx.rect(this.position.x, this.position.y, spriteWidth, spriteHeight);
    }

    private _setup() : void {
        this._loading = true;
        this._image.src = this.src;

        this._image.onerror = () => {
            this._loading = false;
        };
        
        this._image.onload = () => {
            this.draw();
            this._width = this._image.width;
            this._height = this._image.height;

            this._widthFrame = this._width / this.spriteGrid.cols;
            this._heightFrame = this._height / this.spriteGrid.rows;
            setTimeout(() => {
                this._loading = false;
            }, 1000);
        };
    }

    public getWidth(): number {
        return this._getWidthFrame();
    }

    public getHeight(): number {
        return this._getHeightFrame();
    }

    public setWidth(width: number) : Sprite {
        this._width = width;
        return this;
    }

    public setHeight(height: number) : Sprite {
        this._height = height;
        return this;
    }

    public setDebug(debugged: boolean) : Sprite {
        this._debugged = debugged;
        return this;
    }

    public setSpeed(speed: number) : Sprite {
        this.speed = speed;
        return this;
    }

    public setLoop(loop: boolean) : Sprite {
        this.loop = loop;
        return this;
    }

    public pause() : Sprite {
        this._paused = true;
        return this;
    }

    public play() : Sprite {
        this._paused = false;
        return this;
    }

    public isPlaying() : boolean {
        return !this._paused;
    }

    public isDebugging() : boolean {
        return this._debugged;
    }

    private static updateGlobalTime(): void {
        const now = performance.now();
        if (now - Sprite._lastGlobalUpdate > 16) {
            Sprite._globalTime = now;
            Sprite._lastGlobalUpdate = now;
        }
    }

    public draw(): void {
        if (!this._running || !this.visible) return;

        Sprite.updateGlobalTime();

        console.log(this._frameIndex, this.endFrame);

        if (this.endFrame == -1) {
            this.endFrame = this.spriteGrid.rows * this.spriteGrid.cols - 1;
        }

        if (this.ignoreFrames.length > 0) {
            while (this.ignoreFrames.includes(this._frameIndex)) {
                this._frameIndex++;
                if (this._frameIndex > this.endFrame) {
                    this._frameIndex = this.startFrame;
                    break;
                }
            }
        }
        
        const currentCol = this._frameIndex % this.spriteGrid.cols;
        const currentRow = Math.floor(this._frameIndex / this.spriteGrid.cols);
        
        const sourceX = currentCol * this._widthFrame;
        const sourceY = currentRow * this._heightFrame;

        this._ctx.save();
        this._ctx.translate(this.position.x, this.position.y);
        this._ctx.rotate(this.rotation);

        if (this._debugged) {
            this._ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
            this._ctx.fillRect(0, 0, this._getWidthFrame(), this._getHeightFrame());
            this._ctx.strokeStyle = "red";
            this._ctx.lineWidth = 1;
            this._ctx.strokeRect(0, 0, this._getWidthFrame(), this._getHeightFrame());
            
            if (this._debugTextDirty || Sprite._globalTime - this._lastDebugUpdate > 166) {
                this._debugText = `F:${this._frameIndex} S:${this._getSpeed()}x`;
                this._debugTextDirty = false;
                this._lastDebugUpdate = Sprite._globalTime;
            }
            
            this._ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            this._ctx.fillRect(0, -20, 80, 18);
            this._ctx.fillStyle = "white";
            this._ctx.font = "12px Arial";
            this._ctx.fillText(this._debugText, 2, -6);
        }

        this._ctx.drawImage(
            this._image,
            sourceX, sourceY,
            this._widthFrame, this._heightFrame,
            0, 0,
            this._getWidthFrame(), this._getHeightFrame()
        );

        this._ctx.restore();

        if (this.isPlaying() && Sprite._globalTime - this._lastFrameUpdate >= this._frameDuration / this._getSpeed()) {
            this._lastFrameUpdate = Sprite._globalTime;
            this._frameIndex++;
            this._debugTextDirty = true;

            if (this._frameIndex > this.endFrame) {
                if (!this.loop) this._paused = true;
                this._frameIndex = this.startFrame;
            }
        }
    }

    public update(): void {
        if (this._loading) {
            this._ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            this._ctx.fillRect(this.position.x, this.position.y, this._getWidthFrame(), this._getHeightFrame());
            return;
        }

        super.update();
        this.draw();
    }
}