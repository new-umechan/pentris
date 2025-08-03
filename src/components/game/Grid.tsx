import { memo } from 'react';
import { Piece } from '@/types/pentomino';
import { GRID_WIDTH, GRID_HEIGHT } from '@/utils/gameLogic';

interface GridProps {
  grid: number[][];
  currentPiece: Piece | null;
  ghostPiece: Piece | null;
}

export const Grid = memo(({ grid, currentPiece, ghostPiece }: GridProps) => {
  // Create a display grid that includes current piece and ghost piece
  const displayGrid = grid.map(row => [...row]);
  
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
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`
                w-6 h-6 border border-game-border/30
                ${cell === 0 ? 'bg-game-grid' : ''}
                ${cell === 1 ? 'bg-game-block border-game-active' : ''}
                ${cell === 2 ? 'bg-game-ghost border-game-ghost' : ''}
                ${cell === 3 ? 'bg-game-active border-game-active shadow-sm' : ''}
              `}
            />
          ))
        )}
      </div>
    </div>
  );
});

Grid.displayName = 'Grid';