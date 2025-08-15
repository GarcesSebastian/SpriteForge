import { Vector } from "../common/Vector";
import { Shape } from "../instances/Shape";

export interface ShapeEventTemplate {
    pointer: {
        relative: Vector;
        absolute: Vector;
    },
    target: Shape;
}

export type ShapeEventClick = ShapeEventTemplate;
export type ShapeEventDragStart = ShapeEventTemplate;
export type ShapeEventDragEnd = ShapeEventTemplate;
export type ShapeEventDrag = ShapeEventTemplate;
export type ShapeEventDestroy = ShapeEventTemplate;
export type ShapeEventSelect = ShapeEventTemplate;
export type ShapeEventDeselect = ShapeEventTemplate;

export interface ShapeEventsMap {
    "click": ShapeEventClick;
    "dragstart": ShapeEventDragStart;
    "dragend": ShapeEventDragEnd;
    "drag": ShapeEventDrag;
    "destroy": ShapeEventDestroy;
    "select": ShapeEventSelect;
    "deselect": ShapeEventDeselect;
}

export type ShapeEventsType = keyof ShapeEventsMap;

type ShapeListenerCallback<T extends ShapeEventsType> = (args?: ShapeEventsMap[T]) => void;

/**
 * Event provider for shape-related events with type-safe event handling
 * Manages event listeners for shape interactions like clicks, drag operations, and lifecycle events
 */
export class ShapeProvider {
    private _listeners: {
        [K in ShapeEventsType]: ShapeListenerCallback<K>[]
    } = {
        "click": [],
        "dragstart": [],
        "dragend": [],
        "drag": [],
        "destroy": [],
        "select": [],
        "deselect": []
    };

    /**
     * Registers an event listener for the specified shape event type
     * @param event - The shape event type to listen for
     * @param callback - The callback function to execute when event occurs
     */
    public on<T extends ShapeEventsType>(event: T, callback: ShapeListenerCallback<T>): void {
        this._listeners[event].push(callback as ShapeListenerCallback<ShapeEventsType>);
    }

    /**
     * Removes an event listener for the specified shape event type
     * @param event - The shape event type to remove listener from
     * @param callback - The callback function to remove
     */
    public off<T extends ShapeEventsType>(event: T, callback: ShapeListenerCallback<T>): void {
        const listeners = this._listeners[event];
        const index = listeners.indexOf(callback as ShapeListenerCallback<ShapeEventsType>);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    /**
     * Emits a shape event to all registered listeners
     * @param event - The shape event type to emit
     * @param args - Optional event arguments to pass to listeners
     */
    public emit<T extends ShapeEventsType>(event: T, args?: ShapeEventsMap[T]): void {
        const listeners = this._listeners[event] as ShapeListenerCallback<T>[];
        listeners.forEach((callback) => {
            callback(args);
        });
    }
}