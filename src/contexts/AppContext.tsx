"use client"

import { createContext, useEffect, useState } from "react";
import { Render } from "@/lib/Render";

interface AppContextProps {
    setup: (canvas: HTMLCanvasElement) => void;
    render: Render | null;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextProps | null>(null);

export const AppContextProvider = ({ children } : { children: React.ReactNode }) => {
    const [render, setRender] = useState<Render | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
  
    const setup = (canvas: HTMLCanvasElement) => {
      if (!canvas) return;
  
      const render = new Render(canvas);
      setRender(render);
      render.start();
      setIsPlaying(true);

      return () => {
        render.stop();
        setIsPlaying(false);
      }
    }

    useEffect(() => {
        if (!render) return;
        if (isPlaying) render.start();
        else render.stop();
    }, [isPlaying, render]);

    return (
        <AppContext.Provider value={{ setup, render, isPlaying, setIsPlaying }}>
            {children}
        </AppContext.Provider>
    )
}