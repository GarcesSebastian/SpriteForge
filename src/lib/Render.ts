import { Vector } from "./common/Vector";
import { RenderCreator } from "./helpers/Render.creator";
import { Shape } from "./instances/Shape";
import { RenderManager } from "./managers/Render.manager";
import { Transformer } from "./common/Transformer";
import { Rect } from "./instances/_shapes/Rect";
import { RenderProvider } from "./providers/Render.provider";
import { Controller } from "./common/Controller";
import { Circle } from "./instances/_shapes/Circle";
import { Sprite } from "./instances/_shapes/Sprite";
import { Arrow } from "./instances/_shapes/Arrow";

/**
 * Main rendering engine for canvas-based 2D graphics and shape management
 * Handles canvas operations, event management, shape rendering, and animation loops
 */
export class Render extends RenderProvider {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    public childrens: Map<string, Shape> = new Map();
    public _controllers: Map<string, Controller> = new Map();
    public _transformer: Transformer | null = null;

    private _mouseVector: Vector = new Vector(0, 0);
    private _target: Shape | this = this;
    private _frameId: number | null = null;
    private _resizeBind: () => void = this.resize.bind(this);
    private _renderBind: () => void = this.render.bind(this);
    private _onClickedBind: (event: MouseEvent) => void = this._onClicked.bind(this);
    private _onTouchStartBind: (event: TouchEvent) => void = this._onTouchStart.bind(this);
    private _onTouchMoveBind: (event: TouchEvent) => void = this._onTouchMove.bind(this);
    private _onTouchEndBind: (event: TouchEvent) => void = this._onTouchEnd.bind(this);
    private _onMouseMoveBind: (event: MouseEvent) => void = this._onMouseMove.bind(this);
    private _onMouseDownBind: (event: MouseEvent) => void = this._onMouseDown.bind(this);
    private _onMouseUpBind: (event: MouseEvent) => void = this._onMouseUp.bind(this);

    private _isTouched: boolean = false;
    
    private _boundary: Rect | null = null;
    private _boundaryStart: Vector | null = null;
    private _isSelecting: boolean = false;
    private _allowSelect: boolean = true;

    private _fps: number = 0;
    private _lastFrameTime: number = performance.now();
    private _frameCount: number = 0;
    
    public _selectedNodes: Shape[] = [];

    public creator: RenderCreator;
    public manager: RenderManager;

    /**
     * Creates a new render instance for the given canvas element
     * @param canvas - The HTML canvas element to render to
     */
    public constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;
        this.creator = new RenderCreator(this);
        this.manager = new RenderManager(this);

        this.setup();
    }

    /**
     * Initializes the render system with configuration and event listeners
     * @private
     */
    private setup() : void {
        this.config();
        this.events();
        this.canvas.focus();
    }

    /**
     * Configures canvas dimensions and boundary settings
     * @private
     */
    private config() : void {
        this.resize();
        this.boundary();
        this._defaultSprites();
    }

    /**
     * Creates default sprites for testing and demonstration purposes
     * @private
     */
    private _defaultSprites() : void {
        const config = localStorage.getItem("config");
        if (config) {
            const parsedConfig = JSON.parse(config);
            if (parsedConfig.setup) return;
        }

        localStorage.setItem("config", JSON.stringify({
            setup: true
        }));

        const default_sprites = [
            { 
                src: "/Warrior/sprite.png", 
                pattern: ["18:25"], 
                spriteGrid: { rows: 17, cols: 6 }, 
                position: { x: 0.1 * this.canvas.width, y: 0.1 * this.canvas.height } 
            },
            { 
                src: "/Warrior/sprite.png", 
                pattern: ["26:36"], 
                spriteGrid: { rows: 17, cols: 6 }, 
                position: { x: 0.3 * this.canvas.width, y: 0.7 * this.canvas.height } 
            },
            { 
                src: "/Warrior/sprite.png", 
                pattern: ["18:25", "0(15)", "26:36", "36(15)"], 
                spriteGrid: { rows: 17, cols: 6 }, 
                position: { x: 0.2 * this.canvas.width, y: 0.4 * this.canvas.height } 
            },
        ]

        default_sprites.forEach(sprite => {
            this.creator.Sprite({
                src: sprite.src,
                spriteGrid: sprite.spriteGrid,
                pattern: sprite.pattern,
                scale: 3,
                position: this.creator.Vector(sprite.position.x, sprite.position.y),
            }).setDebug(true);
        })

        const spriteController = this.creator.Sprite({
            position: this.creator.Vector(0.8 * this.canvas.width, 0.5 * this.canvas.height),
            src: "/character.png",
            spriteGrid: { rows: 4, cols: 4 },
            scale: 3,
            dragging: true
        }).setDebug(true);

        spriteController.manager.controller({
            keywords: {
                up: "w",
                down: "s",
                left: "a",
                right: "d",
                jump: " "
            },
            status: {
                up: ["4:7"],
                down: ["0:3"],
                left: ["12:15"],
                right: ["8:11"],
                jump: ["4"],
                fall: ["8"],
                idle: ["0"]
            },
            speed: 5
        });
    }

    /**
     * Sets up global event listeners for window and mouse interactions
     * @private
     */
    private events() : void {
        window.addEventListener("resize", this._resizeBind);
        window.addEventListener("click", this._onClickedBind);
        window.addEventListener("touchstart", this._onTouchStartBind, { passive: false });
        window.addEventListener("touchmove", this._onTouchMoveBind, { passive: false });
        window.addEventListener("touchend", this._onTouchEndBind, { passive: false });
        window.addEventListener("mousemove", this._onMouseMoveBind);
        window.addEventListener("mousedown", this._onMouseDownBind);
        window.addEventListener("mouseup", this._onMouseUpBind);

        /**
         * Prevents default context menu (right-click) behavior
         */
        this.canvas.addEventListener("contextmenu", (event) => event.preventDefault());
    }

    /**
     * Sets up boundary selection functionality for multi-select operations
     * @private
     */
    private boundary(): void {
        this.on("mousedown", (args) => {
            if (!(args.target instanceof Render) || !this._allowSelect) return;

            this._isSelecting = true;
            this._boundaryStart = args.pointer.relative;
            
            this._boundary = this.creator.Rect({
                position: this.creator.Vector(args.pointer.relative.x, args.pointer.relative.y),
                width: 0,
                height: 0,
                color: "rgba(0, 123, 255, 0.2)",
                zIndex: 1000
            });
            
            this._boundary.dragging = false;
        });

        this.on("mousemove", (args) => {
            if (!this._isSelecting || !this._boundaryStart || !this._boundary || !this._allowSelect) return;

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
            if (!this._isSelecting || !this._boundary || !this._transformer || !this._allowSelect) return;

            const selectedNodes = this._getNodesInBoundary();
            
            if (selectedNodes.length > 0) {
                this._selectedNodes = selectedNodes;
            }

            if (this._boundary) {
                this._boundary.destroy();
                this._boundary = null;
            }
            
            this._isSelecting = false;
            this._boundaryStart = null;
        });
    }

    /**
     * Resizes the canvas to match its container dimensions
     * @private
     */
    private resize(): void {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    /**
     * Returns the shapes in the render in order of their zIndex
     * @private
     */
    private _childs() : Shape[] {
        return [...this.childrens.values()]
            .map((item, index) => ({ item, index }))
            .sort((a, b) => b.index - a.index)
            .map(({item}) => item)
            .sort((a, b) => b.zIndex - a.zIndex);
    }

    /**
     * Returns the shapes in the render in reverse order
     * @private
     */
    private _childsInvert() : Shape[] {
        return this._childs().reverse();
    }

    /**
     * Returns the shapes under the given instance in order of their zIndex
     * @private
     */
    private _getNodesUnder(instance: Shape) : Shape[] {
        const allChilds = [...this.childrens.values()]
            .map((item, index) => ({ item, index }))
            .sort((a, b) => b.index - a.index)
            .map(({item, index}) => ({item, index}));
        
        const instanceData = allChilds.find(child => child.item.id === instance.id);
        if (!instanceData) return [];
        
        return allChilds
            .filter(child => 
                child.item.zIndex < instance.zIndex || 
                (child.item.zIndex === instance.zIndex && child.index < instanceData.index)
            )
            .map(child => child.item);
    }

    /**
     * Returns the shapes above the given instance in order of their zIndex
     * @private
     */
    private _getNodesAbove(instance: Shape) : Shape[] {
        const allChilds = [...this.childrens.values()]
            .map((item, index) => ({ item, index }))
            .sort((a, b) => b.index - a.index)
            .map(({item, index}) => ({item, index}));
        
        const instanceData = allChilds.find(child => child.item.id === instance.id);
        if (!instanceData) return [];
        
        return allChilds
            .filter(child => 
                child.item.zIndex > instance.zIndex || 
                (child.item.zIndex === instance.zIndex && child.index > instanceData.index)
            )
            .map(child => child.item);
    }

    /**
     * Handles mouse click events and determines click targets
     * Performs hit testing on shapes, updates target, and emits click events
     * @param event - The mouse event containing click information
     * @private
     */
    private _onClicked(event: MouseEvent) : void {
        const { clientX, clientY } = event;
        const { left, top, width, height } = this.canvas.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;

        const { target } = event;
        
        if (target !== this.canvas) return;
        if (x < 0 || x > width || y < 0 || y > height) return;

        this._target = this._childsInvert().find((child) => child._isClicked()) ?? this;

        this.emit("click", {
            pointer: {
                absolute: this.creator.Vector(clientX, clientY),
                relative: this.creator.Vector(x, y)
            },
            target: this._target
        });
        
        if (this._target instanceof Shape) {
            this._target.emit("click", {
                pointer: {
                    absolute: this.creator.Vector(clientX, clientY),
                    relative: this.creator.Vector(x, y)
                },
                target: this._target
            });
        }
    }

    /**
     * Handles touch start events and determines touch targets
     * Performs hit testing on shapes, updates target, and emits touch events
     * @param event - The touch event containing touch information
     * @private
     */
    private _onTouchStart(event: TouchEvent) : void {
        this._isTouched = true;
        const { clientX, clientY } = event.touches[0];
        const { left, top, width, height } = this.canvas.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;

        const { target } = event;
        
        if (target !== this.canvas) return;
        if (x < 0 || x > width || y < 0 || y > height) return;

        this._target = this._childsInvert().find((child) => child._isClicked()) ?? this;

        this.emit("touchstart", {
            pointer: {
                absolute: this.creator.Vector(clientX, clientY),
                relative: this.creator.Vector(x, y)
            },
            target: this._target
        });
        
        if (this._target instanceof Shape) {
            this._target.emit("click", {
                pointer: {
                    absolute: this.creator.Vector(clientX, clientY),
                    relative: this.creator.Vector(x, y)
                },
                target: this._target
            });
        }
    }

    /**
     * Handles touch movement events and updates touch position tracking
     * Updates target detection, and emits touchmove events
     * @param event - The touch event containing position information
     * @private
     */
    private _onTouchMove(event: TouchEvent) : void {
        const { clientX, clientY } = event.touches[0];
        const { left, top } = this.canvas.getBoundingClientRect();
        this._mouseVector = this.creator.Vector(clientX - left, clientY - top);
        this.emit("touchmove", { pointer: { absolute: this.creator.Vector(clientX, clientY), relative: this.creator.Vector(clientX - left, clientY - top) }, target: this._target });
    }

    /**
     * Handles touch end events and finalizes touch drag operations
     * Completes touch interactions, and emits touchend events
     * @param event - The touch event containing touch information
     * @private
     */
    private _onTouchEnd(event: TouchEvent) : void {
        if (event.changedTouches.length > 0) {
            const { clientX, clientY } = event.changedTouches[0];
            const { left, top } = this.canvas.getBoundingClientRect();

            this.emit("touchend", { pointer: { absolute: this.creator.Vector(clientX, clientY), relative: this.creator.Vector(clientX - left, clientY - top) }, target: this._target });
        
            if (this._isTouched) {
                this.emit("touch", { pointer: { absolute: this.creator.Vector(clientX, clientY), relative: this.creator.Vector(clientX - left, clientY - top) }, target: this._target });
                this._isTouched = false;
            }
        }
    }

    /**
     * Handles mouse movement events and updates mouse position tracking
     * Updates target detection, and emits mousemove events
     * @param event - The mouse event containing position information
     * @private
     */
    private _onMouseMove(event: MouseEvent) : void {
        const { clientX, clientY } = event;
        const { left, top } = this.canvas.getBoundingClientRect();
        this._mouseVector = this.creator.Vector(clientX - left, clientY - top);

        this.emit("mousemove", { pointer: { absolute: this.creator.Vector(clientX, clientY), relative: this.creator.Vector(clientX - left, clientY - top) }, target: this._target });
    }
    
    /**
     * Handles mouse down events for drag operations and shape interaction
     * Initiates dragging behavior, and emits mousedown events
     * @param event - The mouse event containing position information
     * @private
     */
    private _onMouseDown(event: MouseEvent) : void {
        const { clientX, clientY } = event;
        const { left, top, width, height } = this.canvas.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;

        if (x < 0 || x > width || y < 0 || y > height) return;

        this._target = this._childsInvert().find((child) => child._isClicked()) ?? this;

        this.emit("mousedown", { pointer: { absolute: this.creator.Vector(clientX, clientY), relative: this.creator.Vector(x, y) }, target: this._target });
    }
    
    /**
     * Handles mouse up events and finalizes drag operations
     * Completes boundary selection, and emits mouseup events
     * @param event - The mouse event containing position information
     * @private
     */
    private _onMouseUp(event: MouseEvent) : void {
        const { clientX, clientY } = event;
        const { left, top } = this.canvas.getBoundingClientRect();
        
        this.emit("mouseup", { pointer: { absolute: this.creator.Vector(clientX, clientY), relative: this.creator.Vector(clientX - left, clientY - top) }, target: this._target });
    }

    /**
     * Gets all shapes that intersect with the current selection boundary
     * Used for multi-select operations with boundary rectangle
     * @returns Array of shapes within the boundary area
     * @private
     */
    private _getNodesInBoundary(): Shape[] {
        if (!this._boundary) return [];

        return this._childs().filter(shape => {
            if (shape === this._boundary) return false;
            return shape._isShapeInBoundary(this._boundary!.position.x, this._boundary!.position.y, this._boundary!.width, this._boundary!.height);
        });
    }

    /**
     * Updates the frames per second calculation
     * Tracks frame count and timing for performance monitoring
     * @private
     */
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

    /**
     * Renders the current FPS counter on the canvas
     * Displays performance information in the bottom-left corner
     * @private
     */
    private _showFps() : void {
        const measureText = this.ctx.measureText(`FPS: ${this._fps.toFixed(2)}`);
        const textWidth = measureText.width;
        const textHeight = measureText.fontBoundingBoxAscent + measureText.fontBoundingBoxDescent;
        
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(`FPS: ${this._fps.toFixed(2)}`, this.canvas.width - textWidth - 10, textHeight + 10);
    }

    /**
     * Clears the entire canvas for the next frame
     * @private
     */
    private clear() : void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Main render loop that draws all shapes and UI elements
     * Handles shape sorting, and frame rate display
     * @private
     */
    private render(): void {
        this.clear();

        this._childs().sort((a, b) => a.zIndex - b.zIndex).forEach(shape => shape.update());
        this._transformer?.update();

        this._updateFps();
        this._showFps();
        this._frameId = requestAnimationFrame(this._renderBind);
    }

    /**
     * Enables boundary selection functionality
     * @returns This render instance for method chaining
     */
    public _enableSelect() : Render {
        this._allowSelect = true;
        return this;
    }

    /**
     * Disables boundary selection functionality
     * @returns This render instance for method chaining
     */
    public _disableSelect() : Render {
        this._allowSelect = false;
        return this;
    }

    /**
     * Cancels current selection operation and cleans up selection boundary
     * @returns This render instance for method chaining
     */
    public _cancelSelect() : Render {
        if (this._isSelecting && this._boundary) {
            this._boundary.destroy();
            this._boundary = null;
        }
        
        this._isSelecting = false;
        this._boundaryStart = null;
        this._allowSelect = false;
        return this;
    }

    /**
     * Gets the absolute mouse position relative to the page
     * @returns Vector containing absolute mouse coordinates
     */
    public mousePositionAbsolute() : Vector {
        const { left, top } = this.canvas.getBoundingClientRect();
        return this.creator.Vector(this._mouseVector.x + left, this._mouseVector.y + top);
    }

    /**
     * Gets the mouse position relative to the canvas
     * @returns Vector containing canvas-relative mouse coordinates
     */
    public mousePositionRelative() : Vector {
        return this._mouseVector;
    }

    /**
     * Serializes the render instance and its children into raw data
     * @returns Array of shape raw data objects
     */
    public serialize() : ShapeRawData[] {
        return [...this.childrens.values()].filter((child) => child instanceof Shape && child._autoSave).map((child) => child._rawData());
    }

    /**
     * Deserializes raw data into shape instances and adds them to the render
     * @param data - Array of shape raw data objects
     */
    public deserialize(data: ShapeRawData[]) : void {
        try {
            data.forEach((child) => {
                if (child.type === "circle") {
                    Circle._fromRawData(child as CircleRawData, this);
                } else if (child.type === "rect") {
                    Rect._fromRawData(child as RectRawData, this);
                } else if (child.type === "sprite") {
                    Sprite._fromRawData(child as SpriteRawData, this);
                } else if (child.type === "arrow") {
                    Arrow._fromRawData(child as ArrowRawData, this);
                }
            });
        } catch (error) {
            console.error("Error deserializing shape data:", error);
        }
    }

    /**
     * Auto save the render instance and its children into raw data
     * @returns Array of shape raw data objects
     */
    public autoSave() : void {
        localStorage.setItem("canvas", JSON.stringify(this.serialize()));
    }

    /**
     * Clears the save data and removes all shapes from the render
     */
    public clearSave() : void {
        localStorage.clear();
        this.childrens.clear();
    }

    /**
     * Loads the render instance and its children from raw data
     * Should be called after event listeners are registered
     */
    public load(data: ShapeRawData[]) : void {
        this.deserialize(data);
    }

    /**
     * Starts the animation loop and begins rendering
     * @returns This render instance for method chaining
     */
    public start() : Render {
        if (this._frameId) return this;
        this._frameId = requestAnimationFrame(this._renderBind);
        return this;
    }

    /**
     * Stops the animation loop and pauses rendering
     * @returns This render instance for method chaining
     */
    public stop() : Render {
        if (this._frameId) {
            cancelAnimationFrame(this._frameId);
            this._frameId = null;
        }
        return this;
    }

    /**
     * Destroys the render instance and cleans up all resources
     * Removes event listeners and stops the animation loop
     */
    public destroy() : void {
        this.stop();
        window.removeEventListener("resize", this._resizeBind);
        window.removeEventListener("click", this._onClickedBind);
        window.removeEventListener("touchstart", this._onTouchStartBind);
        window.removeEventListener("touchmove", this._onTouchMoveBind);
        window.removeEventListener("touchend", this._onTouchEndBind);
        window.removeEventListener("mousemove", this._onMouseMoveBind);
        window.removeEventListener("mousedown", this._onMouseDownBind);
        window.removeEventListener("mouseup", this._onMouseUpBind);
    }
}