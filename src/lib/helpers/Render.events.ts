import { Vector } from "../common/Vector";
import { Shape } from "../instances/Shape";
import { Render } from "../Render";

export interface RenderEventsProps {
    pointer: {
        relative: Vector;
        absolute: Vector;
    },
    target: Shape | Render;
}

export type RenderEventsType = "click" | "dragstart" | "dragend" | "drag" | "mousemove" | "mousedown" | "mouseup" | "trmove";

export class RenderEvents {
    private _listeners: Record<string, ((args: RenderEventsProps) => void)[]> = {};

    public on(event: RenderEventsType, callback: (args: RenderEventsProps) => void): void {
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }
        this._listeners[event].push(callback);
    }

    public off(event: RenderEventsType, callback: (args: RenderEventsProps) => void): void {
        if (this._listeners[event]) {
            this._listeners[event] = this._listeners[event].filter((cb) => cb !== callback);
        }
    }

    public emit(event: RenderEventsType, args: RenderEventsProps): void {
        if (this._listeners[event]) {
            this._listeners[event].forEach((callback) => {
                callback(args);
            });
        }
    }
}