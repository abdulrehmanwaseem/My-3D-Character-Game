import {
  Environment,
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import * as THREE from "three";
import { Physics } from "@react-three/rapier";
import CharacterController from "./CharacterController";
import { useControls } from "leva";
import { DustMap } from "./Csgo_Dust_Map";

const Scene = () => {
  const shadowCameraRef = useRef<THREE.OrthographicCamera | null>(null);

  const { positionX, positionY, positionZ } = useControls({
    positionX: { value: -14, min: -500, max: 500, step: 0.5 },
    positionY: { value: 0, min: -500, max: 500, step: 0.5 },
    positionZ: { value: 29.5, min: -500, max: 500, step: 0.5 },
  });

  return (
    <>
      <Perf minimal={true} />
      <OrbitControls maxPolarAngle={Math.PI / 2} />
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
      <Physics>
        <DustMap scale={0.7} position={[positionX, positionY, positionZ]} />

        <CharacterController />
      </Physics>
    </>
  );
};

export default Scene;
