import { useEffect, useCallback } from 'react';

interface KeyboardActions {
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  hardDrop: () => void;
  rotateCW: () => void;
  rotateCCW: () => void;
  rotate180: () => void;
  hold: () => void;
  pauseGame: () => void;
  resetGame: () => void;
}

export const useKeyboardControls = (actions: KeyboardActions) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Prevent default browser behavior for game keys
    const gameKeys = [
      'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 
      'Space', 'KeyZ', 'KeyA', 'ShiftLeft', 'ShiftRight', 'KeyC',
      'KeyP', 'KeyR'
    ];
    
    if (gameKeys.includes(event.code)) {
      event.preventDefault();
    }

    switch (event.code) {
      case 'ArrowLeft':
        actions.moveLeft();
        break;
      case 'ArrowRight':
        actions.moveRight();
        break;
      case 'ArrowDown':
        actions.moveDown();
        break;
      case 'Space':
        actions.hardDrop();
        break;
      case 'ArrowUp':
        actions.rotateCW();
        break;
      case 'KeyZ':
        actions.rotateCCW();
        break;
      case 'KeyA':
        actions.rotate180();
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
      case 'KeyC':
        actions.hold();
        break;
      case 'KeyP':
        actions.pauseGame();
        break;
      case 'KeyR':
        actions.resetGame();
        break;
    }
  }, [actions]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};