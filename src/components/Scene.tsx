import {
  Cloud,
  Environment,
  KeyboardControls,
  OrbitControls,
  OrthographicCamera,
  PositionalAudio,
  Sky,
  Text,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, Physics, RigidBody } from "@react-three/rapier";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { myPlayer, useMultiplayerState } from "playroomkit";
import { Suspense, useMemo, useRef } from "react";
import { AnimationSet, KeyboardControl, SceneProps } from "../types";
import { handleCharacterRespawn } from "../utils/helper";
import { DustMap } from "./Csgo_Dust_Map";
import { MyCharacterModel } from "./MyCharacter";

const Scene = ({ cameraMode, players }: SceneProps) => {
  const INITIAL_POSITION = [
    [0, 20, 0],
    [5, 5, 5],
  ];
  const VOL_DISTANCE = import.meta.env.PROD ? 20 : 0.1;

  const [playerPositions, setPlayerPositions] = useMultiplayerState(
    "playerPositions",
    {}
  );

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
      handleCharacterRespawn(
        rigidBodyRef.current,
        INITIAL_POSITION[0],
        RESPAWN_HEIGHT
      );

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

      <Physics timeStep="vary">
        <DustMap scale={0.7} position={[positionX, positionY, positionZ]} />

        {players.map((player, index) => {
          return player.id === myPlayer().id ? (
            <KeyboardControls key={index} map={keyboardMap}>
              <Suspense fallback={null}>
                <Ecctrl
                  ref={rigidBodyRef}
                  key={`${index}-${cameraMode}`}
                  debug
                  animated
                  position={INITIAL_POSITION[0]}
                  capsuleHalfHeight={0.5}
                  capsuleRadius={0.34}
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
                    <PositionalAudio
                      url="/audios/CSGO_Theme.mp3"
                      distance={VOL_DISTANCE}
                      loop
                      autoplay
                    />
                    <MyCharacterModel
                      scale={0.9}
                      position={[
                        0,
                        -0.9,
                        cameraMode === "first-person" ? -0.7 : 0,
                      ]}
                    />
                  </EcctrlAnimation>
                </Ecctrl>
              </Suspense>
            </KeyboardControls>
          ) : (
            <RigidBody
              key={`remote-${index}`}
              colliders={false}
              lockRotations
              position={playerPositions[player.id] || INITIAL_POSITION[1]}
              linearDamping={12}
              canSleep={false}
            >
              <group position-y={3}>
                <Text fontSize={0.2}>
                  Name
                  <meshStandardMaterial color="grey" />
                </Text>
                <Text fontSize={0.2}>
                  Abdul Rehman
                  <meshStandardMaterial color="grey" />
                </Text>
              </group>

              <MyCharacterModel scale={0.18} position-y={-0.25} />
              <CapsuleCollider args={[0.08, 0.15]} />
            </RigidBody>
          );
        })}
      </Physics>
    </>
  );
};

export default Scene;
