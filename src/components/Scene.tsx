import {
  Cloud,
  Environment,
  KeyboardControls,
  OrbitControls,
  OrthographicCamera,
  PositionalAudio,
  Sky,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { Suspense, useMemo, useRef } from "react";
import { AnimationSet, KeyboardControl, SceneProps } from "../types";
import { handleCharacterRespawn } from "../utils/helper";
import { DustMap } from "./Csgo_Dust_Map";
import { MyCharacterModel } from "./MyCharacter";

const Scene = ({ cameraMode, players = [] }: SceneProps) => {
  const INITIAL_POSITION = [
    [0, 20, 0],
    [5, 3, 5],
  ];
  const VOL_DISTANCE = cameraMode === "first-person" ? 0.03 : 0.1;

  const RESPAWN_HEIGHT = -10;
  const characterURL: string = "/models/My_Character.glb";
  const rigidBodyRef = useRef(null);

  const { positionX, positionY, positionZ } = {
    positionX: -14,
    positionY: 0,
    positionZ: 29.5,
  };

  useFrame(() => {
    if (rigidBodyRef.current) {
      handleCharacterRespawn(rigidBodyRef.current, [0, 20, 0], RESPAWN_HEIGHT);

      //   const position = rigidBodyRef.current.translation();
      //   const positionArray: [number, number, number] = [
      //     position.x,
      //     position.y,
      //     position.z,
      //   ];

      //   setPlayerPositions(
      //     {
      //       ...playerPositions,
      //       [myPlayer().id]: positionArray,
      //     },
      //     true
      //   );
    }
  });

  const keyboardMap: KeyboardControl[] = useMemo(
    () => [
      { name: "forward", keys: ["ArrowUp", "KeyW"] },
      { name: "backward", keys: ["ArrowDown", "KeyS"] },
      { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
      { name: "rightward", keys: ["ArrowRight", "KeyD"] },
      { name: "jump", keys: ["Space"] },
      { name: "run", keys: ["Shift"] },
      { name: "action1", keys: ["KeyE"] },
    ],
    []
  );

  const animationSet: AnimationSet = {
    idle: "Idle",
    walk: "Walk",
    run: "Sprint",
    jump: "Jump",
    jumpIdle: "Jump",
    jumpLand: "Idle",
    fall: "Jump",
    action1: "Dying",
  };

  return (
    <>
      <OrbitControls autoRotate maxPolarAngle={Math.PI / 2} />

      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <Sky sunPosition={[100, 20, 100]} />

      <Cloud position={[0, 11, 20]} speed={0.5} opacity={0.3} color="#d3d3d3" />

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
        />
      </directionalLight>

      <Physics timeStep="vary" debug={import.meta.env.DEV}>
        <DustMap scale={0.7} position={[positionX, positionY, positionZ]} />

        {/* {players.map((player, index) => {
          return player.id === myPlayer().id ? ( */}
        <KeyboardControls map={keyboardMap}>
          <Suspense fallback={null}>
            <Ecctrl
              ref={rigidBodyRef}
              key={cameraMode}
              animated
              // lockRotations
              position={[0, 20, 0]}
              capsuleHalfHeight={0.5}
              capsuleRadius={0.32}
              floatHeight={0.12}
              jumpVel={3}
              maxVelLimit={3}
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
                    camInitDis: -3.5,
                    camMaxDis: -6,
                    camMinDis: -1,
                    camUpLimit: 1.2,
                    camLowLimit: -0.8,
                    camInitDir: { x: 0.2, y: 0 },
                  })}
            >
              <EcctrlAnimation
                characterURL={characterURL}
                animationSet={animationSet}
                key={`animation-${cameraMode}`}
              >
                <MyCharacterModel
                  scale={0.9}
                  position={[0, -0.9, cameraMode === "first-person" ? -0.7 : 0]}
                />
              </EcctrlAnimation>
              <PositionalAudio
                url="/audios/CSGO_Theme.mp3"
                distance={VOL_DISTANCE}
                loop
                autoplay
              />
            </Ecctrl>
          </Suspense>
        </KeyboardControls>

        {/* Box */}
        <Suspense fallback={null}>
          <RigidBody key={`remote`} position={[5, 3, 5]} canSleep={false}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color="cyan"
                emissive="cyan"
                emissiveIntensity={1}
                metalness={0.2}
                roughness={0.1}
                transparent={true}
                opacity={0.8}
              />
            </mesh>

            <pointLight
              position={[0, 0, 0]}
              intensity={2}
              color="cyan"
              distance={5}
              decay={2}
            />
          </RigidBody>
        </Suspense>
      </Physics>
    </>
  );
};

export default Scene;
