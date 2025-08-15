import { Circle as _Circle, CircleProps } from "../instances/_shapes/Circle";
import { Vector as _Vector } from "../common/Vector";
import { Render } from "../Render";
import { Sprite as _Sprite, SpriteProps } from "../instances/_shapes/Sprite";
import { Rect as _Rect, RectProps } from "../instances/_shapes/Rect";
import { Transformer as _Transformer } from "../common/Transformer";

export class RenderCreator {
    private _render: Render;

    public constructor(render: Render) {
        this._render = render;
    }
    
    public Rect(props: RectProps): _Rect {
        const rect = new _Rect(props, this._render);
        this._render.emit("create", { shape: rect })
        return rect;
    }

    public Circle(props: CircleProps): _Circle {
        const circle = new _Circle(props, this._render);
        this._render.emit("create", { shape: circle });
        return circle;
    }

    public Sprite(props: SpriteProps): _Sprite {
        const sprite = new _Sprite(props, this._render);
        this._render.emit("create", { shape: sprite });
        return sprite;
    }
    
    public Vector(x: number, y: number): _Vector {
        return new _Vector(x, y);
    }

    public Transformer(): _Transformer {
        return new _Transformer(this._render.ctx, this._render)
    }
}