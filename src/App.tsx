import { Loader, PositionalAudio } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EcctrlJoystick } from "ecctrl";
import { Leva } from "leva";
import { onPlayerJoin, PlayerState } from "playroomkit";
import { Suspense, useEffect, useState } from "react";
import Scene from "./components/Scene";
import EscapeCursor from "./components/ui/EscapeCursor";
import ToggleCameraView from "./components/ui/ToggleCameraView";
import { CameraMode } from "./types";
import ControlCard from "./components/ui/ControlCard";
import Crosshair from "./components/ui/Crosshair";
import SocialsCard from "./components/ui/SocialsCard";

const App = () => {
  const isMobile = () => window.innerWidth <= 768;
  const [cameraMode, setCameraMode] = useState<CameraMode>("third-person");
  const [players, setPlayers] = useState<PlayerState[]>([]);
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
      <div className="absolute z-10 w-fit top-2 left-2 ">
        <Leva fill collapsed />
      </div>

      <SocialsCard />

      {isMobile() && <EcctrlJoystick buttonNumber={1} />}
      {cameraMode === "first-person" && <Crosshair />}

      <div className="absolute z-10 space-y-2 top-2 right-2">
        {!isMobile() && <EscapeCursor />}

        <ToggleCameraView
          cameraMode={cameraMode}
          setCameraMode={setCameraMode}
        />
        <ControlCard text="Press to play dying animation" keyboardKey={"E"} />
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
