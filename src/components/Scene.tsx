import {
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
import { MyCharacterModel } from "./My_Character";
import Ecctrl, { EcctrlAnimation } from "ecctrl";

const Scene = ({ cameraMode }) => {
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

  const characterURL = "/models/My_Character.glb"; // Adjust to your model path

  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
    // // Optional animation key map
    // { name: "action1", keys: ["1"] },
  ];

  const animationSet: EcctrlAnimation = {
    idle: "Target.001|Target|Armature|Take 001|BaseLayer.001",
    walk: "Target.001|Target|Armature|Take 001|BaseLayer.001 Retarget",
    run: "Target.001|Target|Armature|Take 001|BaseLayer.001 Retarget.001",
    jump: "Target.001|Target|Action",
    air: "Target.001|Target|Action.001",
    landing: "Target.001|Target|Armature|Take 001|BaseLayer.001_Target.001",
  };

  const cameraConfig = {
    firstPerson: {
      camCollision: false,
      camInitDis: 0.0001,
      camMinDis: 0.0001,
      camMaxDis: 0.0001,
      camFollowMult: 1000,
      camLerpMult: 1000,
      turnVelMultiplier: 1,
      turnSpeed: 100,
      mode: "CameraBasedMovement",
    },
    thirdPerson: {
      camInitDis: -4,
      camMaxDis: -6,
      camMinDis: -1,
      camUpLimit: 1.2,
      camLowLimit: -0.8,
    },
  };

  // useEffect(() => {
  //   if (ecctrlRef.current) {
  //     // Update the component based on the new cameraMode
  //     ecctrlRef.current.updateConfig(
  //       cameraMode === "first-person"
  //         ? cameraConfig.firstPerson
  //         : cameraConfig.thirdPerson
  //     );
  //   }
  // }, [cameraMode]);

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
      <Physics timeStep="vary">
        <DustMap scale={0.7} position={[positionX, positionY, positionZ]} />
        {/* <RigidBody colliders="trimesh" lockRotations position={[4, 6, 4]}>
          <Car scale={1} />
          <Zombie position={[0, 0, 2]} rotation={[0, 3.5, 0]} scale={0.5} />
        </RigidBody> */}
        {/* <CharacterController /> */}
        <Suspense fallback={null}>
          <KeyboardControls map={keyboardMap}>
            {/* Character Control */}

            <Ecctrl
              key={cameraMode}
              debug
              position={[0, 15, 0]}
              capsuleHalfHeight={0.5}
              capsuleRadius={0.3}
              floatHeight={0}
              jumpVel={3}
              {...(cameraMode === "first-person"
                ? cameraConfig.firstPerson
                : cameraConfig.thirdPerson)}
            >
              <MyCharacterModel
                animation="move"
                position={[
                  0, // x position
                  -0.8, // y position
                  cameraMode === "first-person" ? -0.5 : 0, // z position
                ]}
              />
            </Ecctrl>
          </KeyboardControls>
        </Suspense>
      </Physics>
    </>
  );
};

//             camCollision={false}
//             camInitDis={0.0001}
//             camMinDis={0.0001}
//             camMaxDis={0.0001}
//             camFollowMult={1000}
//             camLerpMult={1000}
//             turnVelMultiplier={1}
//             turnSpeed={100}
//             mode="CameraBasedMovement"
// <MyCharacterModel animation="move" position={[0, -0.8, -0.5]} />;

// camInitDis={-4} // Changed from -5 to bring camera closer
// camMaxDis={-6} // Changed from -7 to limit max zoom out
// camMinDis={-1}
// camUpLimit={1.2} // Slightly reduced up angle
// camLowLimit={-0.8} // Adjusted down angle

export default Scene;
