import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import Scene from "./components/Scene";
import { EcctrlJoystick } from "ecctrl";
import ToggleCameraView from "./components/ui/ToggleCameraView";
import { CameraMode } from "./types";
import EscapeCursor from "./components/ui/EscapeCursor";

const App = () => {
  const isMobile = () => window.innerWidth <= 768;
  const [cameraMode, setCameraMode] = useState<CameraMode>("third-person");

  return (
    <Suspense fallback={<Loader />}>
      {isMobile() && <EcctrlJoystick buttonNumber={5} />}
      {/* Camera Toggle Switch */}
      {/* <div className="absolute z-10 top-2 right-2  flex items-center gap-3 bg-slate-800/80 p-3 rounded-lg backdrop-blur-sm">
        To Hide/Unhide cursor press: 
        <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
          V
        </kbd>
      </div> */}
      <EscapeCursor />
      <ToggleCameraView cameraMode={cameraMode} setCameraMode={setCameraMode} />
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
        <Scene cameraMode={cameraMode} />
      </Canvas>
      <img
        className="absolute hidden select-none lg:p-5 bg-slate-800/80 backdrop-blur-sm lg:w-60 md:w-40 md:p-3 rounded-xl left-5 bottom-5 md:block"
        src="/images/controls.png"
        alt="control keys"
      />
    </Suspense>
  );
};

export default App;
