"use client"

import { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface SocketContextProps {
    socket: Socket | null;
}

export const SocketContext = createContext<SocketContextProps | null>(null);

const socketInstance = io(`${process.env.NEXT_PUBLIC_WS_URL}`, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(socketInstance);

    useEffect(() => {
        if (!socket) return;
        socket.connect();

        setSocket(socket);

        const onConnect = () => {
            console.log("connected to socket:", socket.id);
        };

        const onDisconnect = (reason: Socket.DisconnectReason) => {
            console.log("disconnected from socket:", reason);
        };

        const onError = (error: Error) => {
            console.log("error from socket:", error);
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("error", onError);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("error", onError);
            socket.disconnect();
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}