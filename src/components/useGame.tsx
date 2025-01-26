import { create } from "zustand";
import { Ray, Vector3, Camera } from "three";

interface GameState {
  curAnimation: string | null;
  animationSet: Record<string, string>;
  bullets: { position: Vector3; direction: Vector3; id: number }[];
  reset: () => void;
  fire: (camera: Camera) => void;
  removeBullet: (id: number) => void;
}

export const useGame = create<GameState>((set) => ({
  curAnimation: null,
  animationSet: {},
  bullets: [],

  reset: () => {
    set((state) => ({ curAnimation: state.animationSet.idle }));
  },

  // Add firing action
  fire: (camera) => {
    set((state) => {
      // Only fire if in idle, walk, or run animation
      if (
        state.curAnimation === state.animationSet.idle ||
        state.curAnimation === state.animationSet.walk ||
        state.curAnimation === state.animationSet.run
      ) {
        const ray = new Ray();
        ray.origin.copy(camera.position);
        ray.direction
          .set(0, 0, -1)
          .unproject(camera)
          .sub(camera.position)
          .normalize();

        return {
          curAnimation: state.animationSet.action4, // Trigger firing animation
          bullets: [
            ...state.bullets,
            {
              position: new Vector3().copy(camera.position),
              direction: new Vector3().copy(ray.direction),
              id: Math.random(),
            },
          ],
        };
      }
      return state;
    });
  },

  removeBullet: (id) =>
    set((state) => ({
      bullets: state.bullets.filter((bullet) => bullet.id !== id),
    })),
}));
