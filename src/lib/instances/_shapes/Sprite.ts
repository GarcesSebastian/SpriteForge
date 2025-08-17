import { Render } from "../../Render";
import { Shape } from "../Shape";

export type SpriteGrid = {
    rows: number,
    cols: number
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
    private _frameDuration: number = 60;
    
    private static _globalTime: number = 0;
    private static _lastGlobalUpdate: number = performance.now();
    private _lastFrameUpdate: number = 0;
    
    private _debugText: string = "";
    private _debugTextDirty: boolean = true;
    private _lastDebugUpdate: number = 0;

    public src: string;
    public scale: number;
    public spriteGrid: SpriteGrid;
    public ignoreFrames: number[];
    public startFrame: number;
    public endFrame: number;
    public pattern: string[] | undefined;
    public speed: number | undefined;
    public loop: boolean | undefined;
    
    private _processedFrames: number[] = [];
    private _patternIndex: number = 0;
    private _patternBackup: string[] | undefined;

    /**
     * Creates a new Sprite instance with animation capabilities
     * @param props - Configuration properties for the sprite
     * @param render - Render context for drawing operations
     */
    public constructor(props: SpriteProps, render: Render) {
        super(props, render);
        this._ctx = render.ctx;
        this.src = props.src;
        this.spriteGrid = props.spriteGrid ?? { rows: 1, cols: 1 };
        this.ignoreFrames = props.ignoreFrames ?? [];
        this.startFrame = props.startFrame ?? 0;
        this.endFrame = props.endFrame ?? this.spriteGrid.rows * this.spriteGrid.cols - 1;
        this.pattern = props.pattern;
        this._patternBackup = props.pattern;
        this.speed = props.speed ?? 1;
        this.scale = props.scale ?? 1;
        this.loop = props.loop ?? true;
        
        if (this.pattern) {
            this._processedFrames = this._parsePattern(this.pattern);
        }

        this._setup();
    }

    /**
     * Gets the scaled width of a single sprite frame
     * @returns The frame width multiplied by scale factor
     * @private
     */
    private _getWidthFrame() : number {
        return this._widthFrame * this.scale;
    }

    /**
     * Gets the scaled height of a single sprite frame
     * @returns The frame height multiplied by scale factor
     * @private
     */
    private _getHeightFrame() : number {
        return this._heightFrame * this.scale;
    }

    /**
     * Gets the current animation speed multiplier
     * @returns The speed value or default of 1
     * @private
     */
    private _getSpeed() : number {
        return this.speed ?? 1;
    }

    /**
     * Checks if the sprite intersects with a given boundary rectangle
     * @param boundaryX - X coordinate of the boundary
     * @param boundaryY - Y coordinate of the boundary
     * @param boundaryWidth - Width of the boundary
     * @param boundaryHeight - Height of the boundary
     * @returns True if sprite intersects with boundary, false otherwise
     */
    public _isShapeInBoundary(boundaryX: number, boundaryY: number, boundaryWidth: number, boundaryHeight: number): boolean {
        const spriteWidth = this._getWidthFrame();
        const spriteHeight = this._getHeightFrame();

        return !(this.position.x + spriteWidth < boundaryX || 
            this.position.x > boundaryX + boundaryWidth ||
            this.position.y + spriteHeight < boundaryY || 
            this.position.y > boundaryY + boundaryHeight);
    }

    /**
     * Determines if the sprite is currently being clicked by the mouse
     * Handles both non-rotated and rotated sprite collision detection
     * @returns True if mouse is clicking within sprite bounds, false otherwise
     */
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

    /**
     * Applies masking effects to the sprite (currently empty implementation)
     * @todo Implement sprite masking functionality
     */
    public _mask() : void {
        const spriteWidth = this._getWidthFrame();
        const spriteHeight = this._getHeightFrame();
        this._ctx.rect(this.position.x, this.position.y, spriteWidth, spriteHeight);
    }

    /**
     * Initializes the sprite by loading the image and setting up dimensions
     * Sets up error handling and calculates frame dimensions once loaded
     * @private
     */
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
                this.play();
            }, 1000);
        };
    }
    
    /**
     * Parse pattern array into frame sequence
     * Examples: ["1", "5", "6:12", "22:-1", "2x8", "1(5)"] 
     * - "1" = frame 1
     * - "5" = frame 5  
     * - "6:12" = frames 6,7,8,9,10,11,12
     * - "22:-1" = frames 22 to end of spritesheet
     * - "1(5)" = frames 1,1,1,1,1 (repeat frame 1 five times)
     */
    private _parsePattern(pattern: string[]): number[] {
        const frames: number[] = [];
        const maxFrame = this.spriteGrid.rows * this.spriteGrid.cols - 1;
        
        for (const item of pattern) {
            if (item.includes('(') && item.includes(')')) {
                const match = item.match(/^(\d+)\((\d+)\)$/);
                if (match) {
                    const frameNumber = parseInt(match[1]);
                    const repeatCount = parseInt(match[2]);
                    
                    for (let i = 0; i < repeatCount; i++) {
                        frames.push(frameNumber);
                    }
                }
            } else if (item.includes(':')) {
                const [startStr, endStr] = item.split(':');
                const start = parseInt(startStr);
                const end = endStr === '-1' ? maxFrame : parseInt(endStr);
                
                for (let i = start; i <= end; i++) {
                    frames.push(i);
                }
            } else {
                frames.push(parseInt(item));
            }
        }
        
        return frames;
    }
    
    /**
     * Updates the global animation timer used for frame synchronization
     * Maintains consistent timing across all sprite instances
     * @private
     * @static
     */
    private static _updateGlobalTime(): void {
        const now = performance.now();
        if (now - Sprite._lastGlobalUpdate > 16) {
            Sprite._globalTime = now;
            Sprite._lastGlobalUpdate = now;
        }
    }

    /**
     * Restores the sprite's pattern to its original state
     * @private
     */
    public _restorePattern() : void {
        if (!this._patternBackup) {
            this.pattern = undefined;
            this._processedFrames = [];
            this._patternIndex = 0;
            return;
        }
        
        this.pattern = this._patternBackup;
        this._processedFrames = this._parsePattern(this._patternBackup);
        this._patternIndex = 0;
    }

    /**
     * Gets the current scaled width of the sprite
     * @returns The sprite width including scale factor
     */
    public getWidth(): number {
        return this._getWidthFrame();
    }

    /**
     * Gets the current scaled height of the sprite
     * @returns The sprite height including scale factor
     */
    public getHeight(): number {
        return this._getHeightFrame();
    }

    /**
     * Sets the sprite width by calculating appropriate scale factor
     * @param width - The desired width in pixels
     * @returns This sprite instance for method chaining
     */
    public setWidth(width: number): Sprite {
        this._width = width;
        this.scale = width / this._widthFrame;
        return this;
    }

    /**
     * Sets the sprite height by calculating appropriate scale factor
     * @param height - The desired height in pixels
     * @returns This sprite instance for method chaining
     */
    public setHeight(height: number): Sprite {
        this._height = height;
        this.scale = height / this._heightFrame;
        return this;
    }

    /**
     * Enables or disables debug visualization for the sprite
     * Shows frame boundaries, frame index, and speed when enabled
     * @param debugged - True to enable debug mode, false to disable
     * @returns This sprite instance for method chaining
     */
    public setDebug(debugged: boolean): Sprite {
        this._debugged = debugged;
        return this;
    }

    /**
     * Sets the animation speed multiplier
     * @param speed - Speed multiplier (1 = normal, 2 = double speed, 0.5 = half speed)
     * @returns This sprite instance for method chaining
     */
    public setSpeed(speed: number): Sprite {
        this.speed = speed;
        return this;
    }

    /**
     * Sets whether the animation should loop continuously
     * @param loop - True to loop animation, false to play once and stop
     * @returns This sprite instance for method chaining
     */
    public setLoop(loop: boolean): Sprite {
        this.loop = loop;
        return this;
    }

    /**
     * Pauses the sprite animation
     * @returns This sprite instance for method chaining
     */
    public pause(): Sprite {
        this._paused = true;
        this.emit("pause", { target: this });
        return this;
    }

    /**
     * Resumes or starts the sprite animation
     * @returns This sprite instance for method chaining
     */
    public play(pattern?: string[]): Sprite {
        this.pause();
        if (pattern) {
            this.pattern = pattern;
            this._processedFrames = this._parsePattern(pattern);
            this._patternIndex = 0;
        }
        this._paused = false;
        this.emit("play", { target: this });
        return this;
    }

    /**
     * Checks if the sprite animation is currently playing
     * @returns True if animation is running and not paused, false otherwise
     */
    public isPlaying(): boolean {
        return !this._paused;
    }

    /**
     * Checks if debug mode is currently enabled
     * @returns True if debug visualization is active, false otherwise
     */
    public isDebugging(): boolean {
        return this._debugged;
    }

    /**
     * Gets the current debug state
     * @returns True if debug mode is enabled, false otherwise
     */
    public get debug(): boolean {
        return this._debugged;
    }

    /**
     * Renders the current sprite frame to the canvas
     * Handles animation timing, frame progression, pattern sequences,
     * debug visualization, and applies transformations (rotation, position)
     */
    public draw(): void {
        if (!this._running || !this.visible) return;

        Sprite._updateGlobalTime();

        let actualFrameIndex: number;
        
        if (this._processedFrames.length > 0) {
            actualFrameIndex = this._processedFrames[this._patternIndex];
        } else {
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
            actualFrameIndex = this._frameIndex;
        }
        
        const currentCol = actualFrameIndex % this.spriteGrid.cols;
        const currentRow = Math.floor(actualFrameIndex / this.spriteGrid.cols);
        
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
                this._debugText = `F:${actualFrameIndex} S:${this._getSpeed()}x`;
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
            this._debugTextDirty = true;

            if (this._processedFrames.length > 0) {
                this._patternIndex++;
                if (this._patternIndex >= this._processedFrames.length) {
                    if (!this.loop) this.pause();
                    this._patternIndex = 0;
                }
            } else {
                this._frameIndex++;
                if (this._frameIndex > this.endFrame) {
                    if (!this.loop) this.pause();
                    this._frameIndex = this.startFrame;
                }
            }
        }
    }

    /**
     * Updates the sprite state and renders it
     * Shows loading placeholder if image is still loading,
     * otherwise calls parent update and draws the sprite
     */
    public update(): void {
        if (this._loading) {
            this._ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            this._ctx.fillRect(this.position.x, this.position.y, this._getWidthFrame(), this._getHeightFrame());
            return;
        }

        super.update();
        this.draw();
    }

    /**
     * Creates a deep copy of this sprite with identical properties
     * @returns A new Sprite instance with the same configuration
     */
    public clone() : Sprite {
        return this._render.creator.Sprite({
            position: this.position.clone(),
            src: this.src,
            spriteGrid: this.spriteGrid,
            ignoreFrames: this.ignoreFrames,
            startFrame: this.startFrame,
            endFrame: this.endFrame,
            pattern: this.pattern,
            speed: this.speed,
            loop: this.loop,
            scale: this.scale,
            zIndex: this.zIndex,
            mask: this.mask,
            rotation: this.rotation,
            visible: this.visible
        });
    }

    /**
     * @internal
     * Returns the raw data of the sprite.
     * @returns The raw data of the sprite.
     */
    public _rawData() : SpriteRawData {
        return {
            id: this.id,
            position: this.position,
            rotation: this.rotation,
            zIndex: this.zIndex,
            mask: this.mask,
            dragging: this.dragging,
            visible: this.visible,
            src: this.src,
            spriteGrid: this.spriteGrid,
            ignoreFrames: this.ignoreFrames,
            startFrame: this.startFrame,
            endFrame: this.endFrame,
            pattern: this.pattern ?? [],
            speed: this.speed ?? 1,
            loop: this.loop ?? false,
            scale: this.scale ?? 1,
        };
    }

    /**
     * @internal
     * Creates a new sprite instance from raw data.
     * @param data - The raw data of the sprite.
     * @returns A new `Sprite` instance with identical properties.
     */
    public static _fromRawData(data: SpriteRawData, render: Render) : Sprite {
        const sprite = render.creator.Sprite(data);
        sprite.position = data.position;
        sprite.rotation = data.rotation;
        sprite.zIndex = data.zIndex;
        sprite.mask = data.mask;
        sprite.dragging = data.dragging;
        sprite.visible = data.visible;
        sprite.src = data.src;
        sprite.spriteGrid = data.spriteGrid;
        sprite.ignoreFrames = data.ignoreFrames;
        sprite.startFrame = data.startFrame;
        sprite.endFrame = data.endFrame;
        sprite.pattern = data.pattern;
        sprite.speed = data.speed;
        sprite.loop = data.loop;
        sprite.scale = data.scale;
        sprite.id = data.id;

        return sprite;
    }
}