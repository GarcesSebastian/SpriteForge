import { Circle as _Circle, CircleProps } from "../instances/_shapes/Circle";
import { Vector as _Vector } from "../common/Vector";
import { Render } from "../Render";
import { Sprite as _Sprite, SpriteProps } from "../instances/_shapes/Sprite";
import { Rect as _Rect, RectProps } from "../instances/_shapes/Rect";

export class RenderCreator {
    private _render: Render;

    public constructor(render: Render) {
        this._render = render;
    }
    
    public Rect(props: RectProps): _Rect {
        return new _Rect(props, this._render);
    }

    public Circle(props: CircleProps): _Circle {
        return new _Circle(props, this._render);
    }

    public Sprite(props: SpriteProps): _Sprite {
        return new _Sprite(props, this._render);
    }
    
    public Vector(x: number, y: number): _Vector {
        return new _Vector(x, y);
    }
}