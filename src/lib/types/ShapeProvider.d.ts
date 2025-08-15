type ShapeEventTemplate = {
    pointer: {
        relative: Vector;
        absolute: Vector;
    },
    target: Shape;
}

type ShapeEventClick = ShapeEventTemplate;
type ShapeEventDragStart = ShapeEventTemplate;
type ShapeEventDragEnd = ShapeEventTemplate;
type ShapeEventDrag = ShapeEventTemplate;
type ShapeEventDestroy = ShapeEventTemplate;
type ShapeEventSelect = ShapeEventTemplate;
type ShapeEventDeselect = ShapeEventTemplate;
type ShapeEventPlay = { target: Shape };
type ShapeEventPause = { target: Shape };

type ShapeEventsMap = {
    "click": ShapeEventClick;
    "dragstart": ShapeEventDragStart;
    "dragend": ShapeEventDragEnd;
    "drag": ShapeEventDrag;
    "destroy": ShapeEventDestroy;
    "select": ShapeEventSelect;
    "deselect": ShapeEventDeselect;
    "play": ShapeEventPlay;
    "pause": ShapeEventPause;
}

type ShapeEventsType = keyof ShapeEventsMap;
type ShapeListenerCallback<T extends ShapeEventsType> = (args?: ShapeEventsMap[T]) => void;