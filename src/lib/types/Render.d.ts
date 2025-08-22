interface Collaborator {
    id: string;
    name: string;
    color: string;
}

interface SocketEvents {
    "user:start": {
        email: string;
        username: string;
        avatar: string;
        token: string;
    },
    "user:mousemove": {
        pointer: {
            absolute: { x: number, y: number };
            relative: { x: number, y: number };
        },
        email: string;
    },
    "user:collaborator": {
        collaborator: Collaborator;
    }
}