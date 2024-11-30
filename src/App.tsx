import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import Scene from "./components/Scene";
import { EcctrlJoystick } from "ecctrl";
import ToggleCameraView from "./components/ui/ToggleCameraView";
import { CameraMode } from "./types";

const App = () => {
  const isMobile = () => window.innerWidth <= 768;
  const [cameraMode, setCameraMode] = useState<CameraMode>("third-person");

  return (
    <Suspense fallback={<Loader />}>
      {isMobile() && <EcctrlJoystick buttonNumber={5} />}
      {/* Camera Toggle Switch */}
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
