/**
 * Utility class providing common mathematical and helper functions
 * Contains static methods for random number generation and other utilities
 */
export class Utils {
    /**
     * Generates a random integer between min and max (inclusive)
     * @param min - The minimum value (inclusive)
     * @param max - The maximum value (inclusive)
     * @returns A random integer within the specified range
     */
    static randomInt(min: number, max: number) : number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generates a random floating-point number between min and max
     * @param min - The minimum value (inclusive)
     * @param max - The maximum value (exclusive)
     * @returns A random float within the specified range
     */
    static randomFloat(min: number, max: number) : number {
        return Math.random() * (max - min) + min;
    }
}