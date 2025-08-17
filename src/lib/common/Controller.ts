import { Vector } from "./Vector"
import { Shape } from "../instances/Shape"

/**
 * Controller class for handling keyboard input, movement, physics, and animations
 * Provides a complete input system with jump physics, gravity, and state-based animations
 * Supports binding/unbinding to different shapes for flexible control management
 */
export class Controller {
    /** The shape currently being controlled, null if unbound */
    private _target: Shape | null = null;
    /** Keyboard mappings for controller actions */
    private _keywords: ControllerKeyWords;
    /** Animation patterns for different controller states */
    private _status: ControllerStatus;
    /** Directional vectors for movement configuration */
    private _config: ControllerConfig = {
        up: Vector.up,
        down: Vector.down,
        left: Vector.left,
        right: Vector.right
    };
    /** Movement speed multiplier */
    private _speed: number = 1;
    /** Set of currently pressed keys */
    private _keysPressed: Set<string> = new Set();
    /** Current animation status for state management */
    private _currentStatus: string | null = null;

    /** Last ground position for jump physics calculations */
    private _lastPosition: Vector = Vector.zero;
    /** Current velocity vector for physics simulation */
    private _velocity: Vector = Vector.zero;
    /** Jump force applied when jumping (positive Y moves down) */
    private _jumpForce: Vector = new Vector(0, 15);
    /** Gravity force constantly applied during jumps */
    private _gravity: Vector = new Vector(0, 0.9);
    /** Whether the controlled shape is currently on the ground */
    private _isOnGround: boolean = true;
    /** Animation frame ID for the update loop */
    private _animationId: number | null = null;
    /** Bound reference to the update method for requestAnimationFrame */
    private _updateBind: () => void = this._update.bind(this);

    /**
     * Creates a new Controller instance with the specified configuration
     * @param props - Configuration object containing keywords, status patterns, and speed
     * @param props.keywords - Keyboard mappings for controller actions (defaults: w/s/a/d/space)
     * @param props.status - Animation patterns for different states
     * @param props.speed - Movement speed multiplier (default: 1)
     */
    public constructor(props: ControllerProps) {
        this._keywords = props.keywords ?? { up: "w", down: "s", left: "a", right: "d", jump: "space" };
        this._speed = props.speed ?? 1;
        this._status = props.status ?? {
            up: ["0(10)"],
            down: ["0(10)"],
            left: ["0(10)"],
            right: ["0(10)"],
            jump: ["0(10)"],
            idle: ["0(10)"]
        };

        this._setup();
    }

    /**
     * Initializes the controller by setting up event listeners and starting the update loop
     * @private
     */
    private _setup(): void {
        this._events();
        this._update();
    }

    /**
     * Sets up keyboard event listeners for keydown and keyup events
     * Manages the set of currently pressed keys for input handling
     * @private
     */
    private _events(): void {
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            this._keysPressed.add(event.key);
        });

        document.addEventListener("keyup", (event: KeyboardEvent) => {
            this._keysPressed.delete(event.key);
        });
    }

    /**
     * Main update loop that handles physics and movement calculations
     * Runs continuously using requestAnimationFrame for smooth 60fps updates
     * @private
     */
    private _update(): void {
        this._updatePhysics();
        this._updateMovement();
        this._animationId = requestAnimationFrame(this._updateBind);
    }

    /**
     * Updates physics simulation including gravity, velocity, and ground collision
     * Only applies physics when the target is not on the ground (jumping/falling)
     * @private
     */
    private _updatePhysics(): void {
        if (!this._target) return;
        if (this._isOnGround) {
            this._velocity = Vector.zero;
            return;
        }

        this._velocity = this._velocity.add(this._gravity);
        this._target.position = this._target.position.add(this._velocity);

        if (this._target.position.y >= this._lastPosition.y) {
            this._isOnGround = true;
            this._velocity = Vector.zero;
            this._target.position.y = this._lastPosition.y;
        }
    }

    /**
     * Handles movement input, jump mechanics, and animation state management
     * Processes keyboard input and updates target position and animation status
     * @private
     */
    private _updateMovement(): void {
        if (!this._target) return;
        let movement = Vector.zero;
        let newStatus: string;

        if (this._keysPressed.has(this._keywords.up)) {
            movement = movement.add(this._config.up);
        }
        if (this._keysPressed.has(this._keywords.down)) {
            movement = movement.add(this._config.down);
        }
        if (this._keysPressed.has(this._keywords.left)) {
            movement = movement.add(this._config.left);
        }
        if (this._keysPressed.has(this._keywords.right)) {
            movement = movement.add(this._config.right);
        }

        if (this._keysPressed.has(this._keywords.jump) && this._isOnGround) {
            this._lastPosition = this._target.position;
            this._isOnGround = false;
            this._velocity = this._jumpForce.scale(-1);
        }

        if (this._keysPressed.size === 0) {
            newStatus = "idle";
        } else {
            if (this._keysPressed.has(this._keywords.jump)) {
                newStatus = "jump";
            } else if (this._keysPressed.has(this._keywords.up)) {
                newStatus = "up";
            } else if (this._keysPressed.has(this._keywords.down)) {
                newStatus = "down";
            } else if (this._keysPressed.has(this._keywords.left)) {
                newStatus = "left";
            } else if (this._keysPressed.has(this._keywords.right)) {
                newStatus = "right";
            } else {
                newStatus = "idle";
            }
        }

        if (newStatus !== this._currentStatus) {
            this._currentStatus = newStatus;
            if (this._hasPlayMethod(this._target)) {
                this._target.play(this._status[newStatus as keyof ControllerStatus]);
            }
        }

        if (movement.x !== 0 || movement.y !== 0) {
            this._target.position = this._target.position.add(movement.normalize().scale(this._speed));
        }
    }

    /**
     * Type guard to check if the target shape has a play method for animations
     * @param target - The shape to check for animation capabilities
     * @returns True if the target has a play method, false otherwise
     * @private
     */
    private _hasPlayMethod(target: Shape): target is Shape & { play: (pattern?: string[]) => any } {
        return 'play' in target && typeof (target as any).play === 'function';
    }

    /**
     * Gets the current keyboard mappings for controller actions
     * @returns The keyboard configuration object
     */
    public get keywords(): ControllerKeyWords {
        return this._keywords;
    }

    /**
     * Gets the current movement speed multiplier
     * @returns The speed value
     */
    public get speed(): number {
        return this._speed;
    }

    /**
     * Sets new keyboard mappings for controller actions
     * @param value - New keyboard configuration object
     */
    public set keywords(value: ControllerKeyWords) {
        this._keywords = value;
    }

    /**
     * Sets the movement speed multiplier
     * @param value - New speed value (higher = faster movement)
     */
    public set speed(value: number) {
        this._speed = value;
    }

    /**
     * Binds the controller to a specific shape for control
     * Allows the controller to move and animate the target shape
     * @param shape - The shape to bind to this controller
     */
    public bind(shape: Shape): void {
        this._target = shape;
    }

    /**
     * Unbinds the controller from its current target
     * The controller will no longer affect any shape until rebound
     */
    public unbind(): void {
        this._target = null;
    }

    /**
     * Destroys the controller and cleans up all resources
     * Stops the update loop, unbinds from target, and clears input state
     */
    public destroy(): void {
        if (this._animationId !== null) {
            cancelAnimationFrame(this._animationId);
            this._animationId = null;
        }
        this.unbind();
        this._keysPressed.clear();
    }
}