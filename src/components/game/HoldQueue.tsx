import { memo } from 'react';
import { PentominoType, PENTOMINO_SHAPES } from '@/types/pentomino';

interface HoldQueueProps {
  holdPiece: PentominoType | null;
  canHold: boolean;
}

export const HoldQueue = memo(({ holdPiece, canHold }: HoldQueueProps) => {
  const renderPiece = (type: PentominoType) => {
    const shape = PENTOMINO_SHAPES[type][0];
    const maxWidth = Math.max(...shape.map(row => row.length));
    const maxHeight = shape.length;
    
    return (
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
                  ? `bg-game-block border border-game-active ${!canHold ? 'opacity-50' : ''}` 
                  : 'bg-transparent'
                }
              `}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="w-20">
      <div className="text-sm font-semibold mb-4 text-center">HOLD</div>
      <div className="mb-4">
        {holdPiece ? (
          <div>
            {renderPiece(holdPiece)}
            <div className="text-xs text-center font-mono text-muted-foreground mt-1">
              {holdPiece}
            </div>
          </div>
        ) : (
          <div className="h-16 bg-card border border-game-border rounded flex items-center justify-center">
            <span className="text-xs text-muted-foreground">EMPTY</span>
          </div>
        )}
      </div>
      {!canHold && (
        <div className="text-xs text-destructive text-center">
          LOCKED
        </div>
      )}
    </div>
  );
});

HoldQueue.displayName = 'HoldQueue';