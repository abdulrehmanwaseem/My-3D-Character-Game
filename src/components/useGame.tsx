import { create } from "zustand";
import { Ray, Vector3, Camera } from "three";

interface GameState {
  curAnimation: string | null;
  animationSet: Record<string, string>;
  bullets: { position: Vector3; direction: Vector3; id: number }[];
  reset: () => void;
  fire: (camera: Camera, gunPosition: Vector3) => void;
  removeBullet: (id: number) => void;
}

// ... existing imports ...

export const useGame = create<GameState>((set) => ({
  curAnimation: null,
  animationSet: {},
  bullets: [],

  reset: () => {
    set((state) => ({
      curAnimation: state.animationSet.idle,
      bullets: [], // Clear bullets on reset
    }));
  },

  fire: (camera, gunPosition, direction) => {
    set((state) => {
      const newBullet = {
        position: gunPosition.clone(),
        direction: direction.clone().normalize(),
        id: Date.now() + Math.random(),
      };

      // Keep only recent bullets
      const bullets = [...state.bullets, newBullet].slice(-20);

      return { bullets };
    });
  },

  removeBullet: (id) => {
    set((state) => ({
      bullets: state.bullets.filter((bullet) => bullet.id !== id),
    }));
  },
}));
