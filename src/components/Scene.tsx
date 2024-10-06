import {
  Environment,
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useRef } from "react";

const Scene = () => {
  const shadowCameraRef = useRef();
  return (
    <>
      <OrbitControls />
      <Environment preset="sunset" />
      <directionalLight
        intensity={0.7}
        castShadow
        // position={[-20, 20, 20]}
        position={[-15, 10, 15]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      >
        <OrthographicCamera
          left={-22}
          right={15}
          top={10}
          bottom={-20}
          attach={"shadow-camera"}
        />
      </directionalLight>
      <ambientLight intensity={0.2} />
      <Perf minimal={true} />
    </>
  );
};

export default Scene;
