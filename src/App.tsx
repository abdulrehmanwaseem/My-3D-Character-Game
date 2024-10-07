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
            // (e.target as HTMLElement).requestPointerLock();
          }
        }}
      >
        <Scene />
      </Canvas>
      // Controls image:
      <img
        className="absolute w-48 left-5 bottom-5 select-none lg:block hidden"
        src="/images/controls.png"
        alt="control keys"
      />
    </Suspense>
  );
};

export default App;
