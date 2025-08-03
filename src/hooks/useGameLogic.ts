import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, Piece, PentominoType } from '@/types/pentomino';
import {
  createInitialGameState,
  createPiece,
  isValidPosition,
  movePiece,
  placePiece,
  clearLines,
  calculateScore,
  tryRotateWithKicks,
  generateBag,
  getGhostPiece,
} from '@/utils/gameLogic';
import { toast } from 'sonner';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [ghostPiece, setGhostPiece] = useState<Piece | null>(null);
  const [bag, setBag] = useState<PentominoType[]>(() => generateBag());
  const [bagIndex, setBagIndex] = useState(0);
  const dropTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize first piece
  useEffect(() => {
    if (!gameState.currentPiece && !gameState.gameOver) {
      spawnNewPiece();
    }
  }, []);

  // Update ghost piece when current piece changes
  useEffect(() => {
    if (gameState.currentPiece) {
      const ghost = getGhostPiece(gameState.currentPiece, gameState.grid);
      setGhostPiece(ghost);
    } else {
      setGhostPiece(null);
    }
  }, [gameState.currentPiece, gameState.grid]);

  // Auto-drop timer
  useEffect(() => {
    if (!gameState.isPaused && !gameState.gameOver && gameState.currentPiece) {
      const dropInterval = Math.max(50, 1000 - (gameState.level - 1) * 50);
      
      dropTimerRef.current = setInterval(() => {
        moveDown();
      }, dropInterval);

      return () => {
        if (dropTimerRef.current) {
          clearInterval(dropTimerRef.current);
        }
      };
    }
  }, [gameState.level, gameState.isPaused, gameState.gameOver, gameState.currentPiece]);

  const getNextPiece = useCallback((): PentominoType => {
    let currentBag = bag;
    let currentIndex = bagIndex;

    if (currentIndex >= currentBag.length) {
      // Generate new bag
      currentBag = generateBag();
      setBag(currentBag);
      currentIndex = 0;
      setBagIndex(0);
    }

    const piece = currentBag[currentIndex];
    setBagIndex(currentIndex + 1);
    return piece;
  }, [bag, bagIndex]);

  const updateNextQueue = useCallback((currentPieceType?: PentominoType) => {
    const nextPieces: PentominoType[] = [];
    let tempBag = [...bag];
    let tempIndex = bagIndex;

    for (let i = 0; i < 5; i++) {
      if (tempIndex >= tempBag.length) {
        tempBag = generateBag();
        tempIndex = 0;
      }
      const piece = tempBag[tempIndex];
      // Skip current piece if it would be in the next queue
      if (piece !== currentPieceType || nextPieces.length > 0) {
        nextPieces.push(piece);
      }
      tempIndex++;
      if (nextPieces.length >= 5) break;
    }

    setGameState(prev => ({ ...prev, nextPieces }));
  }, [bag, bagIndex]);

  const spawnNewPiece = useCallback(() => {
    const pieceType = getNextPiece();
    const newPiece = createPiece(pieceType);

    if (!isValidPosition(newPiece, gameState.grid)) {
      // Game over
      setGameState(prev => ({ ...prev, gameOver: true }));
      toast.error('Game Over!');
      return;
    }

    setGameState(prev => ({ 
      ...prev, 
      currentPiece: newPiece,
      canHold: true
    }));
    updateNextQueue(newPiece.type);
  }, [gameState.grid, getNextPiece, updateNextQueue]);

  const moveLeft = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return;

    const movedPiece = movePiece(gameState.currentPiece, -1, 0);
    if (isValidPosition(movedPiece, gameState.grid)) {
      setGameState(prev => ({ ...prev, currentPiece: movedPiece }));
    }
  }, [gameState.currentPiece, gameState.grid, gameState.gameOver, gameState.isPaused]);

  const moveRight = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return;

    const movedPiece = movePiece(gameState.currentPiece, 1, 0);
    if (isValidPosition(movedPiece, gameState.grid)) {
      setGameState(prev => ({ ...prev, currentPiece: movedPiece }));
    }
  }, [gameState.currentPiece, gameState.grid, gameState.gameOver, gameState.isPaused]);

  const moveDown = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return;

    const movedPiece = movePiece(gameState.currentPiece, 0, 1);
    if (isValidPosition(movedPiece, gameState.grid)) {
      setGameState(prev => ({ ...prev, currentPiece: movedPiece }));
    } else {
      // Lock piece
      const { newGrid, newPieceGrid } = placePiece(gameState.currentPiece, gameState.grid, gameState.pieceGrid);
      const { newGrid: clearedGrid, newPieceGrid: clearedPieceGrid, linesCleared } = clearLines(newGrid, newPieceGrid);
      
      const points = calculateScore(linesCleared, gameState.level);
      const newLines = gameState.lines + linesCleared;
      const newLevel = Math.floor(newLines / 10) + 1;

      if (linesCleared > 0) {
        toast.success(`${linesCleared} line${linesCleared > 1 ? 's' : ''} cleared! +${points}`);
      }

      setGameState(prev => ({
        ...prev,
        grid: clearedGrid,
        pieceGrid: clearedPieceGrid,
        currentPiece: null,
        score: prev.score + points,
        lines: newLines,
        level: newLevel,
      }));

      // Spawn new piece on next frame
      setTimeout(spawnNewPiece, 100);
    }
  }, [gameState.currentPiece, gameState.grid, gameState.gameOver, gameState.isPaused, gameState.lines, gameState.level, spawnNewPiece]);

  const hardDrop = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return;

    const ghost = getGhostPiece(gameState.currentPiece, gameState.grid);
    const droppedPiece = { ...gameState.currentPiece, position: ghost.position };
    
    const { newGrid, newPieceGrid } = placePiece(droppedPiece, gameState.grid, gameState.pieceGrid);
    const { newGrid: clearedGrid, newPieceGrid: clearedPieceGrid, linesCleared } = clearLines(newGrid, newPieceGrid);
    
    const dropBonus = Math.abs(ghost.position.y - gameState.currentPiece.position.y) * 2;
    const points = calculateScore(linesCleared, gameState.level) + dropBonus;
    const newLines = gameState.lines + linesCleared;
    const newLevel = Math.floor(newLines / 10) + 1;

    if (linesCleared > 0) {
      toast.success(`${linesCleared} line${linesCleared > 1 ? 's' : ''} cleared! +${points}`);
    }

    setGameState(prev => ({
      ...prev,
      grid: clearedGrid,
      pieceGrid: clearedPieceGrid,
      currentPiece: null,
      score: prev.score + points,
      lines: newLines,
      level: newLevel,
    }));

    setTimeout(spawnNewPiece, 100);
  }, [gameState.currentPiece, gameState.grid, gameState.gameOver, gameState.isPaused, gameState.lines, gameState.level, spawnNewPiece]);

  const rotateCW = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return;

    const rotatedPiece = tryRotateWithKicks(gameState.currentPiece, 'clockwise', gameState.grid);
    if (rotatedPiece) {
      setGameState(prev => ({ ...prev, currentPiece: rotatedPiece }));
    }
  }, [gameState.currentPiece, gameState.grid, gameState.gameOver, gameState.isPaused]);

  const rotateCCW = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return;

    const rotatedPiece = tryRotateWithKicks(gameState.currentPiece, 'counterclockwise', gameState.grid);
    if (rotatedPiece) {
      setGameState(prev => ({ ...prev, currentPiece: rotatedPiece }));
    }
  }, [gameState.currentPiece, gameState.grid, gameState.gameOver, gameState.isPaused]);

  const rotate180 = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.isPaused) return;

    const rotatedPiece = tryRotateWithKicks(gameState.currentPiece, '180', gameState.grid);
    if (rotatedPiece) {
      setGameState(prev => ({ ...prev, currentPiece: rotatedPiece }));
    }
  }, [gameState.currentPiece, gameState.grid, gameState.gameOver, gameState.isPaused]);

  const hold = useCallback(() => {
    if (!gameState.canHold || gameState.gameOver || gameState.isPaused) return;

    if (gameState.holdPiece) {
      // Swap current and hold piece
      const newPiece = createPiece(gameState.holdPiece);
      if (isValidPosition(newPiece, gameState.grid)) {
        setGameState(prev => ({
          ...prev,
          currentPiece: newPiece,
          holdPiece: prev.currentPiece!.type,
          canHold: false,
        }));
      }
    } else {
      // Store current piece in hold and spawn new piece
      setGameState(prev => ({
        ...prev,
        holdPiece: prev.currentPiece!.type,
        currentPiece: null,
        canHold: false,
      }));
      setTimeout(spawnNewPiece, 100);
    }
  }, [gameState.canHold, gameState.gameOver, gameState.isPaused, gameState.holdPiece, gameState.grid, spawnNewPiece]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const resetGame = useCallback(() => {
    const newGameState = createInitialGameState();
    setGameState(newGameState);
    setGhostPiece(null);
    setBag(generateBag());
    setBagIndex(0);
  }, []);

  return {
    gameState,
    ghostPiece,
    actions: {
      moveLeft,
      moveRight,
      moveDown,
      hardDrop,
      rotateCW,
      rotateCCW,
      rotate180,
      hold,
      pauseGame,
      resetGame,
    },
  };
};