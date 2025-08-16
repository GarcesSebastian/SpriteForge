import { useState } from 'react';
import { Vector } from '@/lib/common/Vector';

interface UseSpriteFormProps {
  onCreateSprite: (props: Omit<SpriteProps, 'position'> & { position: Vector }) => void;
  onClose: () => void;
}

export function useSpriteForm({ onCreateSprite, onClose }: UseSpriteFormProps) {
  const [spriteForm, setSpriteForm] = useState({
    src: '',
    rows: 1,
    cols: 1,
    ignoreFrames: '',
    pattern: '',
    x: 100,
    y: 100
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setSpriteForm({ ...spriteForm, src: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSprite = () => {
    if (!spriteForm.src.trim()) {
      alert('Please provide an image source');
      return;
    }

    const ignoreFrames: number[] = [];
    const ignoreFramesSplited = spriteForm.ignoreFrames.trim().split(",");
    ignoreFramesSplited.forEach((frame) => {
      const frameFormatted = Number(frame);
      if (!isNaN(frameFormatted)) {
        ignoreFrames.push(frameFormatted);
      }

      if (frame.includes(":")) {
        const [start, end] = frame.split(":").map(Number);
        for (let i = start; i <= end; i++) {
          ignoreFrames.push(i);
        }
      }
    });

    let pattern: string[] | undefined = undefined;
    if (spriteForm.pattern.trim()) {
      pattern = spriteForm.pattern.split(',').map(p => p.trim()).filter(p => p);
    }

    onCreateSprite({
      position: new Vector(spriteForm.x, spriteForm.y),
      src: spriteForm.src,
      spriteGrid: { rows: spriteForm.rows, cols: spriteForm.cols },
      ignoreFrames,
      pattern,
      dragging: true
    } as Omit<SpriteProps, 'position'> & { position: Vector });
    onClose();
  };

  return {
    spriteForm,
    setSpriteForm,
    handleFileUpload,
    handleCreateSprite,
  };
}
