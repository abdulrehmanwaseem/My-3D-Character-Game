import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import Scene from "./components/Scene";
import { EcctrlJoystick } from "ecctrl";
import ToggleCameraView from "./components/ui/ToggleCameraView";
import { CameraMode } from "./types";
import EscapeCursor from "./components/ui/EscapeCursor";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Joystick, onPlayerJoin } from "playroomkit";

const App = () => {
  const isMobile = () => window.innerWidth <= 768;
  const [cameraMode, setCameraMode] = useState<CameraMode>("third-person");
  const [players, setPlayers] = useState([]); // State to manage players

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
      {isMobile() && <EcctrlJoystick buttonNumber={5} />}

      <div className="absolute z-10 space-y-2 top-2 right-2 ">
        {/* Escape Cursor */}
        {!isMobile() && <EscapeCursor />}

        {/* Camera Toggle Switch */}
        <ToggleCameraView
          cameraMode={cameraMode}
          setCameraMode={setCameraMode}
        />
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
        <Scene cameraMode={cameraMode} players={players} />
        {/* <EffectComposer>
          <Bloom luminanceThreshold={1} intensity={1.22} />
        </EffectComposer> */}
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
