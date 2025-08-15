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

    public on<T extends ShapeEventsType>(event: T, callback: ShapeListenerCallback<T>): void {
        this._listeners[event].push(callback as ShapeListenerCallback<ShapeEventsType>);
    }

    public off<T extends ShapeEventsType>(event: T, callback: ShapeListenerCallback<T>): void {
        const listeners = this._listeners[event];
        const index = listeners.indexOf(callback as ShapeListenerCallback<ShapeEventsType>);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    public emit<T extends ShapeEventsType>(event: T, args?: ShapeEventsMap[T]): void {
        const listeners = this._listeners[event] as ShapeListenerCallback<T>[];
        listeners.forEach((callback) => {
            callback(args);
        });
    }
}