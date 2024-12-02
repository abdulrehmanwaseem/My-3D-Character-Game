export type CameraMode = "first-person" | "third-person";

export interface ToggleCameraViewProps {
  cameraMode: CameraMode;
  setCameraMode: React.Dispatch<React.SetStateAction<CameraMode>>;
}

export interface SceneProps {
  cameraMode: CameraMode;
  players: [];
}

export interface KeyboardControl {
  name: string;
  keys: string[];
}

export interface AnimationSet {
  idle: string;
  walk: string;
  run: string;
  jump: string;
  jumpIdle: string;
  jumpLand: string;
  fall: string;
}
