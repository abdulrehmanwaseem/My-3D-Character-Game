import { Character } from "./MyCharacter";
import { useControls } from "leva";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const CharacterController = () => {
  const { positionX, positionY, positionZ } = useControls({
    positionX: { value: 3, min: -10, max: 10, step: 0.1 },
    positionY: { value: 0, min: -10, max: 10, step: 0.1 },
    positionZ: { value: 0, min: -10, max: 10, step: 0.1 },
  });

  const container = useRef<THREE.Group>(null);
  const character = useRef<THREE.Group>(null);
  const cameraTarget = useRef<THREE.Group>(null);
  const cameraPosition = useRef<THREE.Group>(null);
  const cameraWorldPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const cameraLookAtWorldPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const cameraLookAt = useRef<THREE.Vector3>(new THREE.Vector3());

  useFrame(({ camera }) => {
    if (cameraPosition.current) {
      cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
      camera.position.lerp(cameraWorldPosition.current, 0.1);
    }

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

      camera.lookAt(cameraLookAt.current);
    }
  });

  return (
    <RigidBody position={[positionX, 0, 0]} colliders={false} lockRotations>
      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={4} position-z={-4} />

        <group ref={character}>
          <Character scale={1} position={[positionX, positionY, positionZ]} />
        </group>
      </group>
      <CapsuleCollider args={[0.7, 0.25]} position={[positionX, 0.9, 0]} />
    </RigidBody>
  );
};

export default CharacterController;
