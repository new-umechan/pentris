import { memo } from 'react';
import { PentominoType, PENTOMINO_SHAPES } from '@/types/pentomino';

const getPentominoColor = (type: PentominoType): string => {
  const colorMap = {
    I: 'bg-[hsl(var(--pentomino-i))]',
    P: 'bg-[hsl(var(--pentomino-p))]',
    U: 'bg-[hsl(var(--pentomino-u))]',
    V: 'bg-[hsl(var(--pentomino-v))]',
    W: 'bg-[hsl(var(--pentomino-w))]',
    X: 'bg-[hsl(var(--pentomino-x))]',
    Y: 'bg-[hsl(var(--pentomino-y))]',
    Z: 'bg-[hsl(var(--pentomino-z))]',
    F: 'bg-[hsl(var(--pentomino-f))]',
    T: 'bg-[hsl(var(--pentomino-t))]',
    L: 'bg-[hsl(var(--pentomino-l))]',
    N: 'bg-[hsl(var(--pentomino-n))]',
  };
  return colorMap[type];
};

interface NextQueueProps {
  nextPieces: PentominoType[];
}

export const NextQueue = memo(({ nextPieces }: NextQueueProps) => {
  const renderPiece = (type: PentominoType, index: number) => {
    const shape = PENTOMINO_SHAPES[type][0];
    const maxWidth = Math.max(...shape.map(row => row.length));
    const maxHeight = shape.length;
    const colorClass = getPentominoColor(type);
    
    return (
      <div key={`${type}-${index}`} className="mb-3">
        <div 
          className="grid gap-px p-2 bg-card border border-game-border rounded mx-auto w-fit"
          style={{
            gridTemplateColumns: `repeat(${maxWidth}, 1fr)`,
            gridTemplateRows: `repeat(${maxHeight}, 1fr)`,
          }}
        >
          {shape.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`
                  w-3 h-3
                  ${cell === 1 
                    ? `${colorClass} border border-game-border` 
                    : 'bg-transparent'
                  }
                `}
              />
            ))
          )}
        </div>
        <div className="text-xs text-center font-mono text-muted-foreground mt-1">
          {type}
        </div>
      </div>
    );
  };

  return (
    <div className="w-20">
      <div className="text-sm font-semibold mb-4 text-center">NEXT</div>
      <div className="space-y-1">
        {nextPieces.slice(0, 5).map((type, index) => renderPiece(type, index))}
      </div>
    </div>
  );
});

NextQueue.displayName = 'NextQueue';