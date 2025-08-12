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
    private _frameTime: number = performance.now();
    private _frameDuration: number = 60;

    public src: string;
    public scale: number | undefined;
    public spriteGrid: SpriteGrid;
    public ignoreFrames: number[];
    public speed: number | undefined;
    public loop: boolean | undefined;

    public constructor(props: SpriteProps, render: Render) {
        super(props, render);
        this._ctx = render.ctx;
        this.src = props.src;
        this.spriteGrid = props.spriteGrid ?? { rows: 1, cols: 1 };
        this.ignoreFrames = props.ignoreFrames ?? [];
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

    public draw(): void {
        if (!this._running) return;

        while (this.ignoreFrames.map((frame) => frame - 1).includes(this._frameIndex)) {
            this._frameIndex++;
            if (this._frameIndex >= this.spriteGrid.rows * this.spriteGrid.cols) {
                this._frameIndex = 0;
                break;
            }
        }
        
        const currentCol = this._frameIndex % this.spriteGrid.cols;
        const currentRow = Math.floor(this._frameIndex / this.spriteGrid.cols);
        
        const sourceX = currentCol * this._widthFrame;
        const sourceY = currentRow * this._heightFrame;

        if (this._debugged) {
            this._ctx.beginPath();
            this._ctx.rect(this.position.x, this.position.y, this._getWidthFrame(), this._getHeightFrame());
            this._ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
            this._ctx.fill();
            this._ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
            this._ctx.lineWidth = 2;
            this._ctx.stroke();
            this._ctx.closePath();

            const debugLines = [
                `Frame: ${this._frameIndex}`,
                `Speed: ${this._getSpeed()}x`,
                `Loop: ${this.loop ? 'Yes' : 'No'}`
            ];

            this._ctx.font = "14px Arial";
            this._ctx.textAlign = "left";
            this._ctx.textBaseline = "top";

            const lineHeight = 18;
            const padding = 8;
            let maxWidth = 0;
            
            debugLines.forEach(line => {
                const textMeasure = this._ctx.measureText(line);
                maxWidth = Math.max(maxWidth, textMeasure.width);
            });

            const textBoxWidth = maxWidth + (padding * 2);
            const textBoxHeight = (debugLines.length * lineHeight) + (padding * 2);

            const textX = this.position.x;
            const textY = this.position.y - textBoxHeight - 5;

            this._ctx.beginPath();
            this._ctx.rect(textX, textY, textBoxWidth, textBoxHeight);
            this._ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            this._ctx.fill();
            this._ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
            this._ctx.lineWidth = 1;
            this._ctx.stroke();
            this._ctx.closePath();

            this._ctx.fillStyle = "white";
            debugLines.forEach((line, index) => {
                this._ctx.fillText(
                    line, 
                    textX + padding, 
                    textY + padding + (index * lineHeight)
                );
            });
        }

        this._ctx.drawImage(
            this._image,
            sourceX, sourceY,
            this._widthFrame, this._heightFrame,
            this.position.x, this.position.y,
            this._getWidthFrame(), this._getHeightFrame()
        );

        if (!this.isPlaying()) return;

        if (performance.now() - this._frameTime >= this._frameDuration / this._getSpeed()) {
            this._frameTime = performance.now();
            this._frameIndex++;

            if (this._frameIndex >= this.spriteGrid.cols * this.spriteGrid.rows) {
                if (!this.loop) this._paused = true;
                this._frameIndex = 0;
            }
        }
    }

    public update(): void {
        if (this._loading) {
            const centerX = this.position.x + this._getWidthFrame() / 2;
            const centerY = this.position.y + this._getHeightFrame() / 2;
        
            const minSize = Math.min(this._getWidthFrame(), this._getHeightFrame());
        
            const outerRadius = minSize * 0.10;
            const innerRadius = minSize * 0.07;
        
            this._ctx.beginPath();
            this._ctx.rect(this.position.x, this.position.y, this._getWidthFrame(), this._getHeightFrame());
            this._ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            this._ctx.fill();
            this._ctx.closePath();
        
            this._ctx.beginPath();
            this._ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
            this._ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
            this._ctx.fillStyle = "white";
            this._ctx.fill("evenodd");
            this._ctx.closePath();
            return;
        }

        super.update();
        this.draw();
    }
}