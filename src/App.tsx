import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./components/Scene";

const App = () => {
  const isMobile = () => window.innerWidth <= 768;

  return (
    <Suspense fallback={<Loader />}>
      <Canvas
        shadows
        camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}
        onPointerDown={(e) => {
          if (!isMobile()) {
            (e.target as HTMLElement).requestPointerLock();
          }
        }}
      >
        <Scene />
      </Canvas>
    </Suspense>
  );
};

export default App;
