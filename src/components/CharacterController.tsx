import { Character } from "./MyCharacter";
import { useControls } from "leva";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";

const CharacterController = () => {
  const { positionX, positionY, positionZ } = useControls({
    positionX: { value: 3, min: -10, max: 10, step: 0.1 },
    positionY: { value: 0, min: -10, max: 10, step: 0.1 },
    positionZ: { value: 0, min: -10, max: 10, step: 0.1 },
  });
  return (
    <RigidBody position={[positionX, 0, 0]} colliders={false}>
      <CapsuleCollider args={[0.7, 0.25]} position={[positionX, 0.9, 0]} />
      <Character scale={1} position={[positionX, positionY, positionZ]} />
    </RigidBody>
  );
};

export default CharacterController;
