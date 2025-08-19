import { Render } from "@/lib/Render";
import { Shape } from "../Shape";
import { Vector } from "@/lib/common/Vector";

export interface PointerProps extends ShapeProps {
    scale?: number;
    color?: string;
}

export interface PointerRawData extends ShapeRawData {
    scale: number;
    color: string;
}

export class Pointer extends Shape {
    private _ctx: CanvasRenderingContext2D;

    private _image: HTMLImageElement = new Image();
    private _imageLoaded: boolean = false;

    private _scale: number;
    private _color: string;

    constructor(props: PointerProps, render: Render, id?: string) {
        super(props, render, id);
        this._ctx = render.ctx;
        this._scale = props.scale ?? 1;
        this._color = props.color ?? "white";
        this.setup();
    }

    private _loadSvg(): Promise<HTMLImageElement> {
        return new Promise(async (resolve) => {
            const response = await fetch("/assets/cursor.svg");
            let svgTxt = await response.text();

            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgTxt, "image/svg+xml");

            const path = svgDoc.querySelector('path');
            if (path) {
                path.setAttribute('fill', this._color);
                path.setAttribute('stroke', this._color);
            }

            const serializer = new XMLSerializer();
            svgTxt = serializer.serializeToString(svgDoc);

            const img = new Image();
            const svgBlob = new Blob([svgTxt], { type: "image/svg+xml" });
            
            img.onload = () => resolve(img);

            img.src = URL.createObjectURL(svgBlob);
        });
    }

    public get width(): number {
        return this._image.width * this._scale;
    }

    public get height(): number {
        return this._image.height * this._scale;
    }

    public async setup(): Promise<void> {
        this._autoSave = false;
        this._image = await this._loadSvg();
        this._imageLoaded = true;
    }

    public _isClicked(): boolean {
        return false;
    }

    public _isShapeInBoundary(boundaryX: number, boundaryY: number, boundaryWidth: number, boundaryHeight: number): boolean {
        return false;
    }

    public draw(): void {
        if (!this._imageLoaded) return;
        
        this._ctx.drawImage(this._image, this.position.x, this.position.y, this._image.width * this._scale, this._image.height * this._scale);
    }

    public update(): void {
        super.update();
        this.draw();
    }

    public clone(): Pointer {
        return this._render.creator.Pointer({
            ...this,
            position: this.position.clone()
        })
    }

    public _rawData(): PointerRawData {
        return {
            id: this.id,
            type: "pointer",
            position: this.position,
            rotation: this.rotation,
            zIndex: this.zIndex,
            dragging: this.dragging,
            visible: this.visible,
            scale: this._scale,
            color: this._color,
        };
    }

    public static _fromRawData(_data: PointerRawData, _render: Render): Pointer {
        const props: PointerProps = {
            position: new Vector(_data.position.x, _data.position.y),
            rotation: _data.rotation,
            zIndex: _data.zIndex,
            dragging: _data.dragging,
            visible: _data.visible,
            scale: _data.scale,
            color: _data.color,
        };

        const shape = new Pointer(props, _render, _data.id);
        shape.setup();
        
        return shape;
    }
}