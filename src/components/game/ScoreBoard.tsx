import { memo } from 'react';

interface ScoreBoardProps {
  score: number;
  lines: number;
  level: number;
}

export const ScoreBoard = memo(({ score, lines, level }: ScoreBoardProps) => {
  return (
    <div className="w-32 space-y-4">
      <div className="bg-card border border-game-border rounded p-3">
        <div className="text-sm font-semibold text-center mb-3">SCORE</div>
        <div className="space-y-2">
          <div>
            <div className="text-xs text-muted-foreground">Score</div>
            <div className="text-lg font-mono font-bold">{score.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Lines</div>
            <div className="text-lg font-mono font-bold">{lines}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Level</div>
            <div className="text-lg font-mono font-bold">{level}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-card border border-game-border rounded p-3">
        <div className="text-sm font-semibold text-center mb-3">CONTROLS</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Move:</span>
            <span className="font-mono">← →</span>
          </div>
          <div className="flex justify-between">
            <span>Soft Drop:</span>
            <span className="font-mono">↓</span>
          </div>
          <div className="flex justify-between">
            <span>Hard Drop:</span>
            <span className="font-mono">Space</span>
          </div>
          <div className="flex justify-between">
            <span>Rotate:</span>
            <span className="font-mono">↑ Z</span>
          </div>
          <div className="flex justify-between">
            <span>180°:</span>
            <span className="font-mono">A</span>
          </div>
          <div className="flex justify-between">
            <span>Hold:</span>
            <span className="font-mono">Shift C</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ScoreBoard.displayName = 'ScoreBoard';