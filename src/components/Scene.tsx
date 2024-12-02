import {
  Cloud,
  Environment,
  KeyboardControls,
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { Physics } from "@react-three/rapier";
import { useControls } from "leva";
import { DustMap } from "./Csgo_Dust_Map";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { AnimationSet, KeyboardControl, SceneProps } from "../types";
import { IdleModel } from "./Idle";

import { useFrame } from "@react-three/fiber";
import { handleCharacterRespawn } from "../utils/helper";
import { Model } from "./3D_Model";
const Scene = ({ cameraMode, players }: SceneProps) => {
  const RESPAWN_HEIGHT = -10;
  const INITIAL_POSITION = [0, 20, 0];
  const characterURL: string = "/models/Idle.glb";

  const shadowCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rigidBodyRef = useRef(null);

  const { positionX, positionY, positionZ } = useControls(
    "Position Controls",
    {
      positionX: { value: -14, min: -500, max: 500, step: 0.5 },
      positionY: { value: 0, min: -500, max: 500, step: 0.5 },
      positionZ: { value: 29.5, min: -500, max: 500, step: 0.5 },
    },
    { collapsed: true }
  );

  useFrame(() => {
    handleCharacterRespawn(
      rigidBodyRef.current,
      INITIAL_POSITION,
      RESPAWN_HEIGHT
    );
  });

  const keyboardMap: KeyboardControl[] = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
  ];

  const animationSet: AnimationSet = {
    idle: "Action",
    walk: "Armature|Take 001|BaseLayer.001 Retarget",
    run: "Armature|Take 001|BaseLayer.001 Retarget",
    jump: "",
    jumpIdle: "Action",
    jumpLand: "",
    fall: "",
  };

  return (
    <>
      <Perf minimal position="top-left" />
      <OrbitControls autoRotate maxPolarAngle={Math.PI / 2} />

      {/* environment and ambient light */}
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />

      {/* Clouds in the sky */}
      <Cloud position={[0, 10, 20]} speed={0.5} opacity={0.8} color="#d3d3d3" />
      <Cloud
        position={[-20, 15, 30]}
        speed={0.3}
        opacity={0.7}
        color="#c0c0c0"
      />

      <directionalLight
        intensity={1.5}
        castShadow
        position={[-15, 20, 15]}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={50}
        shadow-camera-near={1}
        shadow-bias={-0.001}
        color="#ffd0b8"
      >
        <OrthographicCamera
          left={-30}
          right={30}
          top={30}
          bottom={-30}
          attach={"shadow-camera"}
          ref={shadowCameraRef}
        />
      </directionalLight>

      {/* Fill lights for better ambient illumination */}
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#b8d8ff" />
      <pointLight position={[-10, 10, -10]} intensity={0.2} color="#ffe3b8" />

      {/* Spot light for dramatic shadows */}
      <spotLight
        position={[5, 15, 5]}
        angle={0.4}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-bias={-0.0001}
        color="#fff5e6"
        distance={30}
        decay={2}
      />
      <Physics timeStep="vary">
        <DustMap scale={0.7} position={[positionX, positionY, positionZ]} />
        {/* <CharacterController /> */}
        <Suspense fallback={null}>
          <KeyboardControls map={keyboardMap}>
            <Ecctrl
              ref={rigidBodyRef}
              key={cameraMode}
              debug
              position={INITIAL_POSITION}
              capsuleHalfHeight={0.55}
              capsuleRadius={0.3}
              floatHeight={0.2}
              jumpVel={3}
              moveImpulsePointY={0}
              // Auto-balance adjustments
              autoBalanceSpringK={0.7}
              autoBalanceDampingC={0.08}
              // Slope handling
              slopeMaxAngle={0.8}
              slopeUpExtraForce={0.05}
              slopeDownExtraForce={0.1}
              // Camera settings
              {...(cameraMode === "first-person"
                ? {
                    camCollision: false,
                    camInitDis: -0.0001,
                    camMinDis: 0.0001,
                    camMaxDis: 0.0001,
                    camFollowMult: 1000,
                    camLerpMult: 1000,
                    turnVelMultiplier: 1,
                    turnSpeed: 100,
                    mode: "CameraBasedMovement",
                    smoothTime: 0.15,
                    camInitDir: { x: 0, y: 0 },
                  }
                : {
                    camInitDis: -4,
                    camMaxDis: -6,
                    camMinDis: -1,
                    camUpLimit: 1.2,
                    camLowLimit: -0.8,
                    camInitDir: { x: 0.2, y: 0 },
                  })}
            >
              {/* <EcctrlAnimation
                characterURL={characterURL}
                animationSet={animationSet}
                key={cameraMode}
              >
                <IdleModel
                  position={[
                    0,
                    -0.95,
                    cameraMode === "first-person" ? -0.7 : 0,
                  ]}
                /> 
               </EcctrlAnimation> */}
              <Model
                position={[0, -0.95, cameraMode === "first-person" ? -0.7 : 0]}
              />
            </Ecctrl>
          </KeyboardControls>
        </Suspense>
      </Physics>
    </>
  );
};

// <MyCharacterModel
//   key={player.id} // Assuming each player has a unique id
//   animation="idle"
//   position={[
//     index === 1 ? -2 : 0,
//     -0.95,
//     cameraMode === "first-person" ? -0.7 : 0,
//   ]}
// />

export default Scene;
