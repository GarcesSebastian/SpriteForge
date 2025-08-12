"use client"

import { useApp } from "@/hooks/useApp";
import { useEffect, useRef, useState } from "react";
import { Sprite } from "@/lib/instances/_shapes/Sprite";
import { Circle } from "@/lib/instances/_shapes/Circle";
import { Rect } from "@/lib/instances/_shapes/Rect";
import TestPanel from "@/components/client/TestPanel";
import FloatingToolbar from "@/components/client/FloatingToolbar";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setup, render, isPlaying, setIsPlaying } = useApp();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [sprites, setSprites] = useState<Sprite[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [rects, setRects] = useState<Rect[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    setup(canvasRef.current);
  }, [canvasRef]);

  useEffect(() => {
    if (!render) return;
    const circle = render.creator.Circle({
      position: render.creator.Vector(100, 100),
      radius: 50,
    })
    circle.manager.bodyVelocity(render.creator.Vector(1, 0), 5);

    const sprite = render.creator.Sprite({
      position: render.creator.Vector(200, 200),
      src: "/Animations/Ground_Slam.png",
      spriteGrid: { rows: 1, cols: 12 },
      speed: 1
    });

    const sprite2 = render.creator.Sprite({
      position: render.creator.Vector(400, 200),
      src: "/Animations/Ise_Strice.png",
      spriteGrid: { rows: 1, cols: 10 },
      speed: 1
    });
    
    const rect = render.creator.Rect({
      position: render.creator.Vector(600, 200),
      width: 100,
      height: 100,
      color: "red"
    });
    
    setSprites((prev) => [...prev, sprite, sprite2]);
    setCircles((prev) => [...prev, circle]);
    setRects((prev) => [...prev, rect]);
  }, [render]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  const handleDeleteSprite = (spriteToDelete: Sprite) => {
    if (!render) return;
    setSprites((prev) => prev.filter(sprite => sprite.id !== spriteToDelete.id));
    spriteToDelete.destroy();
  };

  const handleCreateSprite = () => {
    console.log("Create Sprite clicked");
  };

  const handleCreateCircle = () => {
    console.log("Create Circle clicked");
  };

  const handleCreateRect = () => {
    console.log("Create Rectangle clicked");
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        id="canvas" 
        className="w-full h-full"
      />
      
      <FloatingToolbar
        onCreateSprite={handleCreateSprite}
        onCreateCircle={handleCreateCircle}
        onCreateRect={handleCreateRect}
      />
      
      <TestPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(!isPanelOpen)}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onStop={handleStop}
        sprites={sprites}
        onDeleteSprite={handleDeleteSprite}
      />
    </div>
  );
}
