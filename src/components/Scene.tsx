import { Environment, OrthographicCamera } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import * as THREE from "three";
import { Physics } from "@react-three/rapier";
import CharacterController from "./CharacterController";
import { DustMap } from "./Csgo_dust_2_Map";

const Scene = () => {
  const shadowCameraRef = useRef<THREE.OrthographicCamera | null>(null);

  return (
    <>
      <Perf minimal={true} />
      {/* <OrbitControls /> */}
      <Environment preset="sunset" />
      <directionalLight
        intensity={0.7}
        castShadow
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
          ref={shadowCameraRef}
        />
      </directionalLight>
      <Physics debug>
        <DustMap scale={0.7} position={[-3, 0, 0]} />
        <CharacterController />
      </Physics>
    </>
  );
};

export default Scene;
