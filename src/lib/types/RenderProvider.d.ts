type RenderEventTemplate = {
    pointer: {
        relative: Vector;
        absolute: Vector;
    },
    target: Shape | Render;
}

type RenderEventClick = RenderEventTemplate;
type RenderEventTouched = RenderEventTemplate;
type RenderEventMouseMove = RenderEventTemplate;
type RenderEventMouseDown = RenderEventTemplate;
type RenderEventMouseUp = RenderEventTemplate;
type RenderEventTouchStart = RenderEventTemplate;
type RenderEventTouchMove = RenderEventTemplate;
type RenderEventTouchEnd = RenderEventTemplate;
type RenderEventCreate = { shape: Shape };

type RenderEventMap = {
    "click": RenderEventClick;
    "touch": RenderEventTouched;
    "mousemove": RenderEventMouseMove;
    "mousedown": RenderEventMouseDown;
    "mouseup": RenderEventMouseUp;
    "touchstart": RenderEventTouchStart;
    "touchmove": RenderEventTouchMove;
    "touchend": RenderEventTouchEnd;
    "create": RenderEventCreate;
}

type RenderEventsType = keyof RenderEventMap;
type ListenerCallback<T extends RenderEventsType> = (args: RenderEventMap[T]) => void;