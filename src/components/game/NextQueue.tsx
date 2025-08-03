import { memo } from 'react';
import { PentominoType, PENTOMINO_SHAPES } from '@/types/pentomino';

interface NextQueueProps {
  nextPieces: PentominoType[];
}

export const NextQueue = memo(({ nextPieces }: NextQueueProps) => {
  const renderPiece = (type: PentominoType, index: number) => {
    const shape = PENTOMINO_SHAPES[type][0];
    const maxWidth = Math.max(...shape.map(row => row.length));
    const maxHeight = shape.length;
    
    return (
      <div key={`${type}-${index}`} className="mb-4">
        <div className="text-xs text-muted-foreground mb-1 text-center">
          {index === 0 ? 'NEXT' : ''}
        </div>
        <div 
          className="grid gap-px p-2 bg-card border border-game-border rounded"
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
                    ? 'bg-game-block border border-game-active' 
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
      <div className="space-y-2">
        {nextPieces.slice(0, 5).map((type, index) => renderPiece(type, index))}
      </div>
    </div>
  );
});

NextQueue.displayName = 'NextQueue';