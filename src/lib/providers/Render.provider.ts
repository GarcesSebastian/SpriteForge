import { Vector } from "../common/Vector";
import { Shape } from "../instances/Shape";
import { Render } from "../Render";

interface RenderEventTemplate {
    pointer: {
        relative: Vector;
        absolute: Vector;
    },
    target: Shape | Render;
}

export type RenderEventClick = RenderEventTemplate;
export type RenderEventMouseMove = RenderEventTemplate;
export type RenderEventMouseDown = RenderEventTemplate;
export type RenderEventMouseUp = RenderEventTemplate;
export interface RenderEventCreate {
    shape: Shape;
}

export interface RenderEventMap {
    "click": RenderEventClick;
    "mousemove": RenderEventMouseMove;
    "mousedown": RenderEventMouseDown;
    "mouseup": RenderEventMouseUp;
    "create": RenderEventCreate;
}

export type RenderEventsType = keyof RenderEventMap;

type ListenerCallback<T extends RenderEventsType> = (args: RenderEventMap[T]) => void;

export class RenderProvider {
    private _listeners: {
        [K in RenderEventsType]: ListenerCallback<K>[]
    } = {
        "click": [],
        "mousemove": [],
        "mousedown": [],
        "mouseup": [],
        "create": []
    };

    public on<T extends RenderEventsType>(event: T, callback: ListenerCallback<T>): void {
        this._listeners[event].push(callback as ListenerCallback<RenderEventsType>);
    }

    public off<T extends RenderEventsType>(event: T, callback: ListenerCallback<T>): void {
        const listeners = this._listeners[event];
        const index = listeners.indexOf(callback as ListenerCallback<RenderEventsType>);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    public emit<T extends RenderEventsType>(event: T, args: RenderEventMap[T]): void {
        const listeners = this._listeners[event] as ListenerCallback<T>[];
        listeners.forEach((callback) => {
            callback(args);
        });
    }
}