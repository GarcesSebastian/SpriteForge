"use client"

import { useApp } from "@/hooks/useApp";
import { useEffect, useRef, useState } from "react";
import { Sprite, SpriteProps } from "@/lib/instances/_shapes/Sprite";
import TestPanel from "@/components/client/TestPanel";
import FloatingToolbar from "@/components/client/FloatingToolbar";
import { Utils } from "@/lib/lib/Utils";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setup, render, isPlaying, setIsPlaying } = useApp();
  const [sprites, setSprites] = useState<Sprite[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    setup(canvasRef.current);
  }, [canvasRef]);

  useEffect(() => {
    if (!render) return;

    const tr = render.creator.Transformer();

    for (let i = 0; i < 1; i++) {
      const sprite = render.creator.Sprite({
        position: render.creator.Vector(Utils.randomInt(0, render.canvas.width - 200), Utils.randomInt(0, render.canvas.height - 200)),
        src: "/Animations/Ground_Slam.png",
        spriteGrid: { rows: 1, cols: 12 },
        dragging: true
      }).setDebug(true);

      setSprites((prev) => [...prev, sprite]);
    }

    const circle = render.creator.Circle({
      position: render.creator.Vector(render.canvas.width / 2, render.canvas.height / 2),
      radius: 50,
      dragging: true
    });

    const rect = render.creator.Rect({
      position: render.creator.Vector(render.canvas.width / 2, render.canvas.height / 2),
      width: 100,
      height: 100,
      rotation: 0,
      dragging: true
    });

    console.log(tr, circle, rect);
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

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        id="canvas" 
        className="w-full h-full"
      />
      
      <FloatingToolbar
        onCreateSprite={handleCreateSprite}
      />
      
      <TestPanel
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onStop={handleStop}
        sprites={sprites}
        onDeleteSprite={handleDeleteSprite}
      />
    </div>
  );
}
