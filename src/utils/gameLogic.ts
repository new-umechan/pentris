import { GameState, Piece, PentominoType, PENTOMINO_SHAPES, SRS_KICK_TABLE, Position } from '../types/pentomino';

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;

export const createEmptyGrid = (): number[][] => {
  return Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(0));
};

export const createEmptyPieceGrid = (): (PentominoType | null)[][] => {
  return Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null));
};

export const createInitialGameState = (): GameState => {
  const bag = generateBag();
  return {
    grid: createEmptyGrid(),
    pieceGrid: createEmptyPieceGrid(),
    currentPiece: null,
    nextPieces: bag.slice(1, 6),
    holdPiece: null,
    canHold: true,
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false,
    isPaused: false,
  };
};

// Generate a bag of all 12 pentomino pieces
export const generateBag = (): PentominoType[] => {
  const pieces: PentominoType[] = ['I', 'P', 'U', 'V', 'W', 'X', 'Y', 'Z', 'F', 'T', 'L', 'N'];
  return shuffleArray([...pieces]);
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const createPiece = (type: PentominoType, position: Position = { x: 3, y: 0 }): Piece => {
  return {
    type,
    shape: PENTOMINO_SHAPES[type][0],
    position,
    rotation: 0,
  };
};

export const rotatePiece = (piece: Piece, direction: 'clockwise' | 'counterclockwise' | '180'): Piece => {
  let newRotation = piece.rotation;
  
  if (direction === 'clockwise') {
    newRotation = (piece.rotation + 1) % 4;
  } else if (direction === 'counterclockwise') {
    newRotation = (piece.rotation + 3) % 4;
  } else if (direction === '180') {
    newRotation = (piece.rotation + 2) % 4;
  }

  return {
    ...piece,
    rotation: newRotation,
    shape: PENTOMINO_SHAPES[piece.type][newRotation],
  };
};

export const isValidPosition = (piece: Piece, grid: number[][]): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] === 1) {
        const newX = piece.position.x + x;
        const newY = piece.position.y + y;

        // Check bounds
        if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) {
          return false;
        }

        // Check collision with existing blocks (only check if newY >= 0)
        if (newY >= 0 && grid[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
};

export const tryRotateWithKicks = (
  piece: Piece,
  direction: 'clockwise' | 'counterclockwise' | '180',
  grid: number[][]
): Piece | null => {
  const rotatedPiece = rotatePiece(piece, direction);
  
  // Try without kick first
  if (isValidPosition(rotatedPiece, grid)) {
    return rotatedPiece;
  }

  // Get kick table key
  let kickKey = '';
  if (direction === 'clockwise') {
    kickKey = `${piece.rotation}->${rotatedPiece.rotation}`;
  } else if (direction === 'counterclockwise') {
    kickKey = `${piece.rotation}->${rotatedPiece.rotation}`;
  } else if (direction === '180') {
    // For 180° rotation, try both possible kick sequences
    const kickKey1 = `${piece.rotation}->${(piece.rotation + 1) % 4}`;
    const kickKey2 = `${(piece.rotation + 1) % 4}->${rotatedPiece.rotation}`;
    
    // Try first kick sequence
    const kicks1 = SRS_KICK_TABLE[kickKey1] || [];
    for (const kick of kicks1) {
      const testPiece = {
        ...rotatedPiece,
        position: {
          x: piece.position.x + kick.x,
          y: piece.position.y + kick.y,
        },
      };
      if (isValidPosition(testPiece, grid)) {
        return testPiece;
      }
    }
    
    // Try second kick sequence
    const kicks2 = SRS_KICK_TABLE[kickKey2] || [];
    for (const kick of kicks2) {
      const testPiece = {
        ...rotatedPiece,
        position: {
          x: piece.position.x + kick.x,
          y: piece.position.y + kick.y,
        },
      };
      if (isValidPosition(testPiece, grid)) {
        return testPiece;
      }
    }
    return null;
  }

  const kicks = SRS_KICK_TABLE[kickKey] || [];
  
  // Try each kick offset
  for (const kick of kicks) {
    const testPiece = {
      ...rotatedPiece,
      position: {
        x: piece.position.x + kick.x,
        y: piece.position.y + kick.y,
      },
    };
    
    if (isValidPosition(testPiece, grid)) {
      return testPiece;
    }
  }

  return null; // Rotation failed
};

export const movePiece = (piece: Piece, dx: number, dy: number): Piece => {
  return {
    ...piece,
    position: {
      x: piece.position.x + dx,
      y: piece.position.y + dy,
    },
  };
};

export const placePiece = (piece: Piece, grid: number[][], pieceGrid: (PentominoType | null)[][]): { newGrid: number[][]; newPieceGrid: (PentominoType | null)[][] } => {
  const newGrid = grid.map(row => [...row]);
  const newPieceGrid = pieceGrid.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] === 1) {
        const newX = piece.position.x + x;
        const newY = piece.position.y + y;
        if (newY >= 0 && newY < GRID_HEIGHT && newX >= 0 && newX < GRID_WIDTH) {
          newGrid[newY][newX] = 1;
          newPieceGrid[newY][newX] = piece.type;
        }
      }
    }
  }
  
  return { newGrid, newPieceGrid };
};

export const clearLines = (grid: number[][], pieceGrid: (PentominoType | null)[][]): { newGrid: number[][]; newPieceGrid: (PentominoType | null)[][]; linesCleared: number } => {
  const fullLines: number[] = [];
  
  // Find full lines
  for (let y = 0; y < GRID_HEIGHT; y++) {
    if (grid[y].every(cell => cell !== 0)) {
      fullLines.push(y);
    }
  }
  
  if (fullLines.length === 0) {
    return { newGrid: grid, newPieceGrid: pieceGrid, linesCleared: 0 };
  }
  
  // Remove full lines and add empty lines at top
  const newGrid = grid.filter((_, index) => !fullLines.includes(index));
  const newPieceGrid = pieceGrid.filter((_, index) => !fullLines.includes(index));
  const emptyLines = Array(fullLines.length).fill(null).map(() => Array(GRID_WIDTH).fill(0));
  const emptyPieceLines = Array(fullLines.length).fill(null).map(() => Array(GRID_WIDTH).fill(null));
  
  return {
    newGrid: [...emptyLines, ...newGrid],
    newPieceGrid: [...emptyPieceLines, ...newPieceGrid],
    linesCleared: fullLines.length,
  };
};

export const calculateScore = (linesCleared: number, level: number): number => {
  const baseScores = [0, 40, 100, 300, 1200, 2000]; // 0, 1, 2, 3, 4, 5 lines
  return (baseScores[Math.min(linesCleared, 5)] || 2000) * level;
};

export const getDropPosition = (piece: Piece, grid: number[][]): number => {
  let dropY = piece.position.y;
  
  while (isValidPosition({ ...piece, position: { ...piece.position, y: dropY + 1 } }, grid)) {
    dropY++;
  }
  
  return dropY;
};

export const getGhostPiece = (piece: Piece, grid: number[][]): Piece => {
  const dropY = getDropPosition(piece, grid);
  return {
    ...piece,
    position: {
      ...piece.position,
      y: dropY,
    },
  };
};