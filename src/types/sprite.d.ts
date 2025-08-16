import { Vector } from '@/lib/common/Vector';

interface SpriteProps {
  src: string;
  spriteGrid: {
    rows: number;
    cols: number;
  };
  position: Vector;
  ignoreFrames?: number[];
  pattern?: string[];
  dragging?: boolean;
}
