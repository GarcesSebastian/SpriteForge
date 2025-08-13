export class Utils {
    static randomInt(min: number, max: number) : number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomFloat(min: number, max: number) : number {
        return Math.random() * (max - min) + min;
    }
}