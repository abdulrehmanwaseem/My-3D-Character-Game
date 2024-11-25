import { useControls } from "leva";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { lerpAngle } from "../utils/helper.ts";
// import { CharacterModel } from "./MyCharacter.tsx";
// import { Model } from "./MY-3D-Character-IDLE.tsx";
import { Model2 } from "./FINAL2.tsx";
import { CharacterModel } from "./MyCharacter.tsx";
import { MyCharacterModel } from "./My_3D_Character.tsx";

interface Movement {
  x: number;
  y: number;
  z: number;
}

interface RigidBodyRef {
  linvel: () => { x: number; y: number; z: number };
  setLinvel: (vel: { x: number; y: number; z: number }, wake: boolean) => void;
}

type AnimationState = "idle" | "move";

const CharacterController = () => {
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED, JUMP_FORCE } = useControls(
    "Character Controls",
    {
      WALK_SPEED: { value: 1.8, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 2.6, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(0.5),
        min: degToRad(0.1),
        max: degToRad(5),
        step: degToRad(0.1),
      },
      JUMP_FORCE: { value: 3.8, min: 1, max: 8, step: 0.1 },
    }
  );

  const rigidBody = useRef<RigidBodyRef | null>();
  const container = useRef<THREE.Group>(null);
  const character = useRef<THREE.Group>(null);
  const [isGrounded, setIsGrounded] = useState(true);
  const [animation, setAnimation] = useState<AnimationState>("idle");

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef<THREE.Group>(null);
  const cameraPosition = useRef<THREE.Group>(null);
  const cameraWorldPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const cameraLookAtWorldPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const cameraLookAt = useRef<THREE.Vector3>(new THREE.Vector3());
  const [_, get] = useKeyboardControls();
  const isClicking = useRef(false);

  useEffect(() => {
    const onMouseDown = (_: TouchEvent) => {
      isClicking.current = true;
    };
    const onMouseUp = (_: TouchEvent) => {
      isClicking.current = false;
    };

    document.addEventListener("touchstart", onMouseDown);
    document.addEventListener("touchend", onMouseUp);
    return () => {
      document.removeEventListener("touchstart", onMouseDown);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, []);

  useFrame(({ camera, mouse }) => {
    if (rigidBody.current) {
      const vel = rigidBody.current?.linvel();

      if (Math.abs(vel.y) < 0.1) {
        setIsGrounded(true);
      } else {
        setIsGrounded(false);
      }

      const inAir = Math.abs(vel.y) > 0.1;
      setIsGrounded(!inAir);

      const movement: Movement = {
        x: 0,
        z: 0,
        y: 0,
      };

      let isMoving = "idle";

      if (get().forward) {
        movement.z = 1;
        isMoving = "move";
      }

      if (get().backward) {
        movement.z = -1;
        isMoving = "move";
      }

      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      if (isClicking.current) {
        console.log("clicking", mouse.x, mouse.y);
        if (Math.abs(mouse.x) > 0.1) {
          movement.x = -mouse.x;
        }
        movement.z = mouse.y + 0.4;
        if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
          speed = RUN_SPEED;
        }
      }

      if (get().left) {
        isMoving = "move";
        movement.x = 1;
      }
      if (get().right) {
        isMoving = "move";
        movement.x = -1;
      }

      if (Math.abs(vel.y) < 0.1 && !isGrounded) {
        setIsGrounded(true);
      }

      if (get().jump && !inAir) {
        if (isGrounded) {
          movement.y = JUMP_FORCE;
          setIsGrounded(false);
        }
      }

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);

        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;
      }
      if (movement.y !== 0) {
        vel.y = JUMP_FORCE;
      }

      setAnimation(isMoving);

      if (character.current) {
        character.current.rotation.y = lerpAngle(
          character.current.rotation.y,
          characterRotationTarget.current,
          0.1
        );
      }

      rigidBody.current.setLinvel(vel, true);
    }

    // Camera rotation and movement
    if (container.current) {
      container.current.rotation.y = THREE.MathUtils.lerp(
        container.current?.rotation.y,
        rotationTarget.current,
        0.1
      );
    }

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
    <RigidBody
      colliders={false}
      lockRotations
      ref={rigidBody}
      position={[0, 5, 0]}
    >
      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={1} position-z={-3} />

        <group ref={character}>
          <MyCharacterModel animation={animation} scale={0.8} />
        </group>
      </group>
      <CapsuleCollider args={[0.49, 0.21]} position={[0, 0.7, 0]} />
    </RigidBody>
  );
};

export default CharacterController;
