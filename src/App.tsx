import { KeyboardControls, Loader, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import Scene from "./components/Scene";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];

type CameraMode = "third-person" | "first-person";

const App = () => {
  const isMobile = () => window.innerWidth <= 768;
  const [cameraMode, setCameraMode] = useState<CameraMode>("third-person");

  return (
    <Suspense fallback={<Loader />}>
      {/* Camera Toggle Switch */}
      <div className="absolute top-5 right-5 z-10 w-[9.5rem] flex items-center gap-3 bg-slate-800/80 p-3 rounded-lg backdrop-blur-sm">
        <span className="text-sm font-medium text-white">
          {cameraMode === "third-person" ? "3rd Person" : "1st Person"}
        </span>
        <button
          onClick={() =>
            setCameraMode((prev) =>
              prev === "third-person" ? "first-person" : "third-person"
            )
          }
          className="relative inline-flex items-center h-6 transition-colors duration-300 rounded-full w-11"
          style={{
            backgroundColor:
              cameraMode === "first-person" ? "#4F46E5" : "#374151",
          }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
              cameraMode === "first-person" ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

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
          <Scene cameraMode={cameraMode} />
        </Canvas>
      </KeyboardControls>
      <img
        className="absolute hidden p-5 select-none bg-slate-900 w-60 rounded-xl left-5 bottom-5 lg:block"
        src="/images/controls.png"
        alt="control keys"
      />
    </Suspense>
  );
};

export default App;
