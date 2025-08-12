"use client"

import { useApp } from "@/hooks/useApp";
import { useEffect, useRef, useState } from "react";
import { Sprite, SpriteGrid, SpriteProps } from "@/lib/instances/_shapes/Sprite";
import { Circle, CircleProps } from "@/lib/instances/_shapes/Circle";
import { Rect, RectProps } from "@/lib/instances/_shapes/Rect";
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
    const circle1 = render.creator.Circle({
      position: render.creator.Vector(100, 100),
      radius: 50,
      zIndex: 1
    })

    const circle2 = render.creator.Circle({
      position: render.creator.Vector(100, 100),
      radius: 30,
      zIndex: 2,
      color: "red",
      mask: true,
      dragging: true
    })
    
    const rect = render.creator.Rect({
      position: render.creator.Vector(100, 100),
      width: 30,
      height: 100,
      color: "red",
      zIndex: 3,
      mask: true,
      dragging: true
    });

    // circle1.on("click", (event) => {
    //   console.log("Circle1 clicked", event);
    // })

    // circle2.on("click", (event) => {
    //   console.log("Circle2 clicked", event);
    // })

    render.on("click", (event) => {
      console.log("Canvas clicked", event);
    })

    // circle.manager.bodyVelocity(render.creator.Vector(1, 0), 5);

    const sprite = render.creator.Sprite({
      position: render.creator.Vector(200, 200),
      src: "/Animations/Ground_Slam.png",
      spriteGrid: { rows: 1, cols: 12 },
      scale: 0.5,
      speed: 1
    });

    const sprite2 = render.creator.Sprite({
      position: render.creator.Vector(400, 200),
      src: "/Animations/Ise_Strice.png",
      spriteGrid: { rows: 1, cols: 10 },
      scale: 0.5,
      speed: 1
    });
    
    setSprites((prev) => [...prev, sprite, sprite2]);
    setCircles((prev) => [...prev, circle1, circle2]);
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

  const handleCreateSprite = (props: SpriteProps) => {
    if (!render) return;

    const sprite = render.creator.Sprite(props);

    setSprites((prev) => [...prev, sprite]);
  };

  const handleCreateCircle = (props: CircleProps) => {
    if (!render) return;

    const circle = render.creator.Circle(props);
    setCircles((prev) => [...prev, circle]);
  };

  const handleCreateRect = (props: RectProps) => {
    if (!render) return;

    const rect = render.creator.Rect(props);
    setRects((prev) => [...prev, rect]);
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        id="canvas" 
        className="w-[800px] h-[500px] border border-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
