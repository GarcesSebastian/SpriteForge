interface Collaborator {
    id: string;
    name: string;
    color: string;
}

interface SocketEvents {
    mousemove: {
        pointer: {
            absolute: { x: number, y: number };
            relative: { x: number, y: number };
        },
        email: string;
    }
}