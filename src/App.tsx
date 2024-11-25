import { KeyboardControls, Loader, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./components/Scene";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];

const App = () => {
  const isMobile = () => window.innerWidth <= 768;

  return (
    <Suspense fallback={<Loader />}>
      <KeyboardControls map={keyboardMap}>
        <Canvas
          style={{
            touchAction: "none",
          }}
          shadows
          camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}
          onPointerDown={(e) => {
            if (!isMobile()) {
              (e.target as HTMLElement).requestPointerLock();
            }
          }}
        >
          <SoftShadows size={42} />
          <Scene />
        </Canvas>
      </KeyboardControls>
      <img
        className="absolute bg-slate-900 p-5 w-60 rounded-xl left-5 bottom-5 select-none lg:block hidden"
        src="/images/controls.png"
        alt="control keys"
      />
    </Suspense>
  );
};

export default App;
