import { Render } from "../Render";
import { Shape } from "../instances/Shape";
import { Transformer } from "../common/Transformer";

export class RenderManager {
    private _render: Render;

    public constructor(render: Render) {
        this._render = render;
    }

    public addChild(child: Shape) : void {
        this._render.childrens.set(child.id, child);
    }

    public removeChild(child: Shape) : void {
        this._render.childrens.delete(child.id);
    }

    public addTransformer(transformer: Transformer) : void {
        this._render._transformers.set(transformer.id, transformer);
    }

    public removeTransformer(transformer: Transformer) : void {
        this._render._transformers.delete(transformer.id);
    }
}