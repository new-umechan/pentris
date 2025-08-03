export type PentominoType = 'I' | 'P' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | 'F' | 'T' | 'L' | 'N';

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: PentominoType;
  shape: number[][];
  position: Position;
  rotation: number;
}

export interface GameState {
  grid: number[][];
  currentPiece: Piece | null;
  nextPieces: PentominoType[];
  holdPiece: PentominoType | null;
  canHold: boolean;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
}

export interface KickData {
  x: number;
  y: number;
}

// SRS Kick tables for wall kicks
export const SRS_KICK_TABLE: Record<string, KickData[]> = {
  // 0 -> 1 (0° -> 90°)
  '0->1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  // 1 -> 0 (90° -> 0°)
  '1->0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  // 1 -> 2 (90° -> 180°)
  '1->2': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  // 2 -> 1 (180° -> 90°)
  '2->1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  // 2 -> 3 (180° -> 270°)
  '2->3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  // 3 -> 2 (270° -> 180°)
  '3->2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  // 3 -> 0 (270° -> 0°)
  '3->0': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  // 0 -> 3 (0° -> 270°)
  '0->3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
};

// Pentomino shape definitions (5 blocks each)
export const PENTOMINO_SHAPES: Record<PentominoType, number[][][]> = {
  I: [
    // Rotation 0
    [
      [1, 1, 1, 1, 1]
    ],
    // Rotation 1
    [
      [1],
      [1],
      [1],
      [1],
      [1]
    ],
    // Rotation 2
    [
      [1, 1, 1, 1, 1]
    ],
    // Rotation 3
    [
      [1],
      [1],
      [1],
      [1],
      [1]
    ]
  ],
  P: [
    // Rotation 0
    [
      [1, 1],
      [1, 1],
      [1, 0]
    ],
    // Rotation 1
    [
      [1, 1, 1],
      [0, 1, 1]
    ],
    // Rotation 2
    [
      [0, 1],
      [1, 1],
      [1, 1]
    ],
    // Rotation 3
    [
      [1, 1, 0],
      [1, 1, 1]
    ]
  ],
  U: [
    // Rotation 0
    [
      [1, 0, 1],
      [1, 1, 1]
    ],
    // Rotation 1
    [
      [1, 1],
      [1, 0],
      [1, 1]
    ],
    // Rotation 2
    [
      [1, 1, 1],
      [1, 0, 1]
    ],
    // Rotation 3
    [
      [1, 1],
      [0, 1],
      [1, 1]
    ]
  ],
  V: [
    // Rotation 0
    [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1]
    ],
    // Rotation 1
    [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0]
    ],
    // Rotation 2
    [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1]
    ],
    // Rotation 3
    [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1]
    ]
  ],
  W: [
    // Rotation 0
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 1]
    ],
    // Rotation 1
    [
      [0, 1, 1],
      [1, 1, 0],
      [1, 0, 0]
    ],
    // Rotation 2
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 1]
    ],
    // Rotation 3
    [
      [0, 0, 1],
      [0, 1, 1],
      [1, 1, 0]
    ]
  ],
  X: [
    // Rotation 0
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    // Rotation 1
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    // Rotation 2
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    // Rotation 3
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0]
    ]
  ],
  Y: [
    // Rotation 0
    [
      [0, 1, 0, 0],
      [1, 1, 1, 1]
    ],
    // Rotation 1
    [
      [1, 0],
      [1, 1],
      [1, 0],
      [1, 0]
    ],
    // Rotation 2
    [
      [1, 1, 1, 1],
      [0, 1, 0, 0]
    ],
    // Rotation 3
    [
      [0, 1],
      [0, 1],
      [1, 1],
      [0, 1]
    ]
  ],
  Z: [
    // Rotation 0
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ],
    // Rotation 1
    [
      [0, 0, 1],
      [1, 1, 1],
      [1, 0, 0]
    ],
    // Rotation 2
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ],
    // Rotation 3
    [
      [0, 0, 1],
      [1, 1, 1],
      [1, 0, 0]
    ]
  ],
  F: [
    // Rotation 0
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0]
    ],
    // Rotation 1
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    // Rotation 2
    [
      [0, 1, 0],
      [0, 1, 1],
      [1, 1, 0]
    ],
    // Rotation 3
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 1]
    ]
  ],
  T: [
    // Rotation 0
    [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0]
    ],
    // Rotation 1
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 1]
    ],
    // Rotation 2
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 1]
    ],
    // Rotation 3
    [
      [1, 0, 0],
      [1, 1, 1],
      [1, 0, 0]
    ]
  ],
  L: [
    // Rotation 0
    [
      [1, 0, 0, 0],
      [1, 1, 1, 1]
    ],
    // Rotation 1
    [
      [1, 1],
      [1, 0],
      [1, 0],
      [1, 0]
    ],
    // Rotation 2
    [
      [1, 1, 1, 1],
      [0, 0, 0, 1]
    ],
    // Rotation 3
    [
      [0, 1],
      [0, 1],
      [0, 1],
      [1, 1]
    ]
  ],
  N: [
    // Rotation 0
    [
      [0, 1, 0, 0],
      [1, 1, 1, 1]
    ],
    // Rotation 1
    [
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 1]
    ],
    // Rotation 2
    [
      [1, 1, 1, 1],
      [0, 0, 1, 0]
    ],
    // Rotation 3
    [
      [1, 0],
      [1, 0],
      [1, 1],
      [0, 1]
    ]
  ]
};