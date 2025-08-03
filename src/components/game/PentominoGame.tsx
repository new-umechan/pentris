import { useEffect } from 'react';
import { Grid } from './Grid';
import { NextQueue } from './NextQueue';
import { HoldQueue } from './HoldQueue';
import { ScoreBoard } from './ScoreBoard';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const PentominoGame = () => {
  const { gameState, ghostPiece, actions } = useGameLogic();
  
  useKeyboardControls(actions);

  useEffect(() => {
    // Show welcome message
    toast.success('Welcome to Pentomino Tetris! Use arrow keys to play.');
  }, []);

  const handlePauseClick = () => {
    actions.pauseGame();
    if (!gameState.isPaused) {
      toast.info('Game paused. Press P to resume.');
    } else {
      toast.info('Game resumed!');
    }
  };

  const handleResetClick = () => {
    actions.resetGame();
    toast.info('New game started!');
  };

  return (
    <div className="min-h-screen bg-game-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            PENTOMINO TETRIS
          </h1>
          <p className="text-muted-foreground">
            12-piece bag system • SRS rotation • Monochrome minimal design
          </p>
        </div>

        <div className="flex justify-center items-start gap-8">
          {/* Hold Queue */}
          <HoldQueue 
            holdPiece={gameState.holdPiece} 
            canHold={gameState.canHold}
          />

          {/* Main Game Area */}
          <div className="flex flex-col items-center">
            <Grid 
              grid={gameState.grid}
              pieceGrid={gameState.pieceGrid}
              currentPiece={gameState.currentPiece}
              ghostPiece={ghostPiece}
            />
            
            {/* Game Controls */}
            <div className="mt-6 flex gap-4">
              <Button 
                variant="outline" 
                onClick={handlePauseClick}
                className="px-6"
              >
                {gameState.isPaused ? 'RESUME (P)' : 'PAUSE (P)'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleResetClick}
                className="px-6"
              >
                RESET (R)
              </Button>
            </div>

            {/* Game Status */}
            {gameState.gameOver && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded text-center">
                <div className="text-lg font-bold text-destructive mb-2">GAME OVER</div>
                <div className="text-sm text-muted-foreground">Press R to start a new game</div>
              </div>
            )}

            {gameState.isPaused && !gameState.gameOver && (
              <div className="mt-4 p-4 bg-accent border border-game-border rounded text-center">
                <div className="text-lg font-bold">PAUSED</div>
                <div className="text-sm text-muted-foreground">Press P to resume</div>
              </div>
            )}
          </div>

          {/* Next Queue */}
          <NextQueue nextPieces={gameState.nextPieces} />

          {/* Score Board */}
          <ScoreBoard 
            score={gameState.score}
            lines={gameState.lines}
            level={gameState.level}
          />
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-card border border-game-border rounded p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Game Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">12-Piece System</h4>
                <p className="text-muted-foreground">
                  Uses all 12 pentomino pieces (I, P, U, V, W, X, Y, Z, F, T, L, N) in a bag system.
                  Each piece appears exactly once per bag before reshuffling.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">SRS Rotation</h4>
                <p className="text-muted-foreground">
                  Implements Super Rotation System with wall kicks for smooth gameplay.
                  Supports 90°, 180°, and counterclockwise rotations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Modern Features</h4>
                <p className="text-muted-foreground">
                  Includes hold functionality, ghost piece preview, next queue display,
                  and progressive level increase with line clearing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};