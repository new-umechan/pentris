import { memo } from 'react';
import { Piece, PentominoType } from '@/types/pentomino';
import { GRID_WIDTH, GRID_HEIGHT } from '@/utils/gameLogic';

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

interface GridProps {
  grid: number[][];
  pieceGrid: (PentominoType | null)[][];
  currentPiece: Piece | null;
  ghostPiece: Piece | null;
}

export const Grid = memo(({ grid, pieceGrid, currentPiece, ghostPiece }: GridProps) => {
  // Create a display grid that includes current piece and ghost piece
  const displayGrid = grid.map(row => [...row]);
  const pieceTypeGrid: (PentominoType | null)[][] = pieceGrid.map(row => [...row]);
  
  // Add ghost piece to display grid
  if (ghostPiece) {
    for (let y = 0; y < ghostPiece.shape.length; y++) {
      for (let x = 0; x < ghostPiece.shape[y].length; x++) {
        if (ghostPiece.shape[y][x] === 1) {
          const gridX = ghostPiece.position.x + x;
          const gridY = ghostPiece.position.y + y;
          if (
            gridY >= 0 && 
            gridY < GRID_HEIGHT && 
            gridX >= 0 && 
            gridX < GRID_WIDTH &&
            displayGrid[gridY][gridX] === 0
          ) {
            displayGrid[gridY][gridX] = 2; // Ghost piece marker
          }
        }
      }
    }
  }
  
  // Add current piece to display grid
  if (currentPiece) {
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x] === 1) {
          const gridX = currentPiece.position.x + x;
          const gridY = currentPiece.position.y + y;
          if (
            gridY >= 0 && 
            gridY < GRID_HEIGHT && 
            gridX >= 0 && 
            gridX < GRID_WIDTH
          ) {
            displayGrid[gridY][gridX] = 3; // Current piece marker
            pieceTypeGrid[gridY][gridX] = currentPiece.type;
          }
        }
      }
    }
  }

  return (
    <div className="inline-block border-2 border-game-border bg-game-background">
      <div 
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, 1fr)`,
        }}
      >
        {displayGrid.map((row, y) =>
          row.map((cell, x) => {
            const pieceType = pieceTypeGrid[y][x];
            const colorClass = pieceType ? getPentominoColor(pieceType) : '';
            
            return (
              <div
                key={`${x}-${y}`}
                className={`
                  w-6 h-6 border border-game-border/30
                  ${cell === 0 ? 'bg-game-grid' : ''}
                  ${cell === 1 ? `${colorClass} border-game-border shadow-sm` : ''}
                  ${cell === 2 ? 'bg-game-ghost border-game-ghost' : ''}
                  ${cell === 3 ? `${colorClass} border-game-border shadow-sm` : ''}
                `}
              />
            );
          })
        )}
      </div>
    </div>
  );
});

Grid.displayName = 'Grid';