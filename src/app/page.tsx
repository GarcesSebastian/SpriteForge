"use client"

import { useApp } from "@/hooks/useApp";
import { useEffect, useRef, useState } from "react";
import { Sprite } from "@/lib/instances/_shapes/Sprite";
import BottomPanel from "@/components/client/BottomPanel";
import FloatingToolbar from "@/components/client/FloatingToolbar";
import { FloatingGitHubButton } from "@/components/client/FloatingGitHubButton";
import ControllerModal from "@/components/client/ControllerModal";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setup, render, isPlaying, setIsPlaying, isControllerModalOpen, selectedSpriteForController } = useApp();
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

        args.shape.on("select", () => {
          setSelectedSprites((prev) => [...prev, args.shape as unknown as Sprite])
          if (args.shape instanceof Sprite && args.shape.controller) {
            args.shape.controller.bind(args.shape);
          }
        });

        args.shape.on("deselect", () => {
          setSelectedSprites((prev) => prev.filter(sprite => sprite.id !== args.shape.id))
          if (args.shape instanceof Sprite && args.shape.controller) {
            args.shape.controller.unbind();
          }
        });
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
        setSelectedSprites((prev) => prev.filter(s => s.id !== sprite.id));
        setPlayingSprites((prev) => prev.filter(s => s.id !== sprite.id));
      })
    });

    return () => {
      sprites.forEach(sprite => {
        sprite.off("destroy", () => {
          setSprites((prev) => prev.filter(s => s.id !== sprite.id));
          setSelectedSprites((prev) => prev.filter(s => s.id !== sprite.id));
          setPlayingSprites((prev) => prev.filter(s => s.id !== sprite.id));
        })
      })
    }
  }, [sprites]);

  useEffect(() => {
    if (!render) return;

    render.creator.Transformer();
    const spriteController = render.creator.Sprite({
      position: render.creator.Vector(render.canvas.width / 2, render.canvas.height / 2),
      src: "/character.png",
      spriteGrid: { rows: 4, cols: 4 },
      scale: 3,
      dragging: true
    });

    spriteController.manager.controller({
      keywords: {
        up: "w",
        down: "s",
        left: "a",
        right: "d",
        jump: " "
      },
      status: {
        up: ["4:7"],
        down: ["0:3"],
        left: ["12:15"],
        right: ["8:11"],
        jump: ["4(10)"],
        idle: ["0(10)"]
      },
      speed: 5
    });
    
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
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onStop={handleStop}
      />
      <BottomPanel
        sprites={sprites}
        selectedSprites={selectedSprites}
        playingSprites={playingSprites}
        onDeleteSprite={handleDeleteSprite}
      />

      <FloatingGitHubButton url="https://github.com/GarcesSebastian/sprite-tools" />

      {isControllerModalOpen && selectedSpriteForController && (
        <ControllerModal/>
      )}
    </div>
  );
}
