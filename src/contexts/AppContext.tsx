"use client"

import { createContext, useEffect, useState } from "react";
import { Render } from "@/lib/Render";
import { Sprite } from "@/lib/instances/_shapes/Sprite";

interface AppContextProps {
    setup: (canvas: HTMLCanvasElement) => void;
    render: Render | null;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    isControllerModalOpen: boolean;
    setIsControllerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedSpriteForController: Sprite | null;
    setSelectedSpriteForController: React.Dispatch<React.SetStateAction<Sprite | null>>;
    spriteControlled: Sprite | null;
    setSpriteControlled: React.Dispatch<React.SetStateAction<Sprite | null>>;
}

export const AppContext = createContext<AppContextProps | null>(null);

export const AppContextProvider = ({ children } : { children: React.ReactNode }) => {
    const [render, setRender] = useState<Render | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isControllerModalOpen, setIsControllerModalOpen] = useState(false);
    const [selectedSpriteForController, setSelectedSpriteForController] = useState<Sprite | null>(null);
    const [spriteControlled, setSpriteControlled] = useState<Sprite | null>(null);

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
        <AppContext.Provider value={{ 
            setup, render, isPlaying, 
            setIsPlaying, isControllerModalOpen, setIsControllerModalOpen, 
            selectedSpriteForController, setSelectedSpriteForController,
            spriteControlled, setSpriteControlled 
        }}>
            {children}
        </AppContext.Provider>
    )
}