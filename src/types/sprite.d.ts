import { Vector } from '@/lib/common/Vector';

interface SpriteProps {
  position: typeof Vector;
  src: string;
  spriteGrid: { rows: number; cols: number };
  ignoreFrames: number[];
  pattern?: string[];
  dragging: boolean;
}
