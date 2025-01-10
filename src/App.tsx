import { Loader, PositionalAudio } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EcctrlJoystick } from "ecctrl";
import { Leva } from "leva";
import { onPlayerJoin } from "playroomkit";
import { Suspense, useEffect, useState } from "react";
import Scene from "./components/Scene";
import EscapeCursor from "./components/ui/EscapeCursor";
import ToggleCameraView from "./components/ui/ToggleCameraView";
import { CameraMode } from "./types";

const App = () => {
  const isMobile = () => window.innerWidth <= 768;
  const [cameraMode, setCameraMode] = useState<CameraMode>("third-person");
  const [players, setPlayers] = useState([]); // State to manage players
  const isHighPerformance = window.navigator.hardwareConcurrency > 4;

  useEffect(() => {
    onPlayerJoin((state) => {
      setPlayers((prev) => [...prev, state]);

      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id !== state.id));
      });
    });
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      {isMobile() && <EcctrlJoystick buttonNumber={1} />}
      <div className="absolute z-10 left-[38.5%]">
        <Leva fill hidden />
      </div>
      <div className="absolute z-10 space-y-2 top-2 right-2 ">
        {/* Escape Cursor */}
        {!isMobile() && <EscapeCursor />}

        {/* Camera Toggle Switch */}
        <ToggleCameraView
          cameraMode={cameraMode}
          setCameraMode={setCameraMode}
        />
      </div>
      <div className="absolute z-10 space-y-2 top-[7.2rem] right-2">
        <span className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-800 rounded-lg w-fit bg-slate-800/80 backdrop-blur-sm dark:text-gray-100">
          Press for dying animation
          <span className="px-2 py-1.5 text-xs font-semibold bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            E
          </span>
        </span>
      </div>
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
        <Scene cameraMode={cameraMode} players={[]} />
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
