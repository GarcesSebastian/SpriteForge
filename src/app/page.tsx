"use client"

import { useApp } from "@/hooks/useApp";
import { useEffect, useRef, useState } from "react";
import { Sprite, SpriteProps } from "@/lib/instances/_shapes/Sprite";
import TestPanel from "@/components/client/TestPanel";
import FloatingToolbar from "@/components/client/FloatingToolbar";
import { Utils } from "@/lib/lib/Utils";
import { RenderEventCreate, RenderEventMouseMove } from "@/lib/providers/Render.provider";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setup, render, isPlaying, setIsPlaying } = useApp();
  const [sprites, setSprites] = useState<Sprite[]>([]);
  const [selectedSprites, setSelectedSprites] = useState<Sprite[]>([]);
  const [playingSprites, setPlayingSprites] = useState<Sprite[]>([]);
  const createCallbackRef = useRef<((args: RenderEventCreate) => void) | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    setup(canvasRef.current);
  }, [canvasRef]);

  if (!createCallbackRef.current) {
    createCallbackRef.current = (args: RenderEventCreate) => {
      if (args.shape instanceof Sprite) {
        setSprites((prev) => [...prev, args.shape as unknown as Sprite]);

        args.shape.on("select", () => setSelectedSprites((prev) => [...prev, args.shape as unknown as Sprite]));
        args.shape.on("deselect", () => setSelectedSprites((prev) => prev.filter(sprite => sprite.id !== args.shape.id)));
        args.shape.on("play", () => setPlayingSprites((prev) => [...prev, args.shape as unknown as Sprite]));
        args.shape.on("pause", () => setPlayingSprites((prev) => prev.filter(sprite => sprite.id !== args.shape.id)));
      }
    };
  }

  useEffect(() => {
    if (!render || !createCallbackRef.current) return;

    render.on("create", createCallbackRef.current);

    return () => {
      if (render && createCallbackRef.current) {
        render.off("create", createCallbackRef.current);
      }
    };
  }, [render]);

  useEffect(() => {
    if (!render) return;

    const onMouseMove = (args: RenderEventMouseMove) => {
      render.childrens.forEach(child => {
        if (!child.bodyVelocity) return;
        child.bodyVelocity.direction = args.pointer.relative.sub(child.position).normalize();
        child.bodyVelocity.speed = 5;
      })
    }

    render.on("mousemove", onMouseMove);

    return () => {
      render.off("mousemove", onMouseMove);
    };
  }, [render]);

  useEffect(() => {
    sprites.forEach(sprite => {
      sprite.on("destroy", () => {
        setSprites((prev) => prev.filter(s => s.id !== sprite.id));
      })
    });

    return () => {
      sprites.forEach(sprite => {
        sprite.off("destroy", () => {
          setSprites((prev) => prev.filter(s => s.id !== sprite.id));
        })
      })
    }
  }, [sprites]);

  useEffect(() => {
    if (!render) return;

    render.creator.Transformer();

    for (let i = 0; i < 1; i++) {
      render.creator.Sprite({
        position: render.creator.Vector(Utils.randomInt(0, render.canvas.width - 200), Utils.randomInt(0, render.canvas.height - 200)),
        src: "/Animations/Explosive_Strike.png",
        spriteGrid: { rows: 1, cols: 9 },
        dragging: true
      }).setDebug(true);
    }

    const circle = render.creator.Circle({
      position: render.creator.Vector(render.canvas.width / 2, render.canvas.height / 2),
      radius: 50,
      zIndex: 2,
      dragging: true
    });

    const rect = render.creator.Rect({
      position: render.creator.Vector(render.canvas.width / 2, render.canvas.height / 2),
      width: 100,
      height: 100,
      rotation: 0,
      dragging: true
    })
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
    render.creator.Sprite(props);
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
        selectedSprites={selectedSprites}
        playingSprites={playingSprites}
        onDeleteSprite={handleDeleteSprite}
      />
    </div>
  );
}
