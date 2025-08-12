export class Vector {
    public x: number;
    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public sub(vector: Vector): Vector {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    public add(vector: Vector): Vector {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    public scale(scale: number): Vector {
        return new Vector(this.x * scale, this.y * scale);
    }

    public mul(vector: Vector): Vector {
        return new Vector(this.x * vector.x, this.y * vector.y);
    }

    public div(vector: Vector): Vector {
        return new Vector(this.x / vector.x, this.y / vector.y);
    }

    public len(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public normalize(): Vector {
        const len = this.len();
        return new Vector(this.x / len, this.y / len);
    }
}
