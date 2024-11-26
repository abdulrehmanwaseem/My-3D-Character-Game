import {
  Environment,
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import * as THREE from "three";
import { Physics, RigidBody } from "@react-three/rapier";
import CharacterController from "./CharacterController";
import { useControls } from "leva";
import { DustMap } from "./Csgo_Dust_Map";
import Car from "./Car";
import Zombie from "./Zombie";

const Scene = () => {
  const shadowCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const { positionX, positionY, positionZ } = useControls(
    "Position Controls",
    {
      positionX: { value: -14, min: -500, max: 500, step: 0.5 },
      positionY: { value: 0, min: -500, max: 500, step: 0.5 },
      positionZ: { value: 29.5, min: -500, max: 500, step: 0.5 },
    },
    { collapsed: true }
  );

  return (
    <>
      <Perf minimal={true} position="top-left" />
      <OrbitControls autoRotate maxPolarAngle={Math.PI / 2} />
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
        <RigidBody colliders="trimesh" lockRotations position={[4, 6, 4]}>
          <Car scale={1} />
          <Zombie position={[0, 0, 2]} rotation={[0, 3.5, 0]} scale={0.5} />
        </RigidBody>
        <CharacterController />
      </Physics>
    </>
  );
};

export default Scene;
