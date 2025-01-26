import {
  Cloud,
  Environment,
  KeyboardControls,
  OrbitControls,
  OrthographicCamera,
  PositionalAudio,
  Sky,
  Trail,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { useControls } from "leva";
import { Suspense, useMemo, useRef, useState } from "react";
import { AnimationSet, KeyboardControl, SceneProps } from "../types";
import { handleCharacterRespawn } from "../utils/helper";
import { AK47_GUN } from "./Ak47_GUN";
import { DustMap } from "./Csgo_Dust_Map";
import { MyCharacterModel } from "./MyCharacter";
import { useGame } from "./useGame";
import { Audio, Vector3 } from "three";
import MouseController from "./MouseController";

const Scene = ({ cameraMode, players = [] }: SceneProps) => {
  const [showMuzzleFlash, setShowMuzzleFlash] = useState(false);
  const [shake, setShake] = useState(0);

  const shootSoundRef = useRef();

  const isFirstPerson = cameraMode === "first-person";
  const characterURL: string = "/models/My_Character.glb";
  const { position } = useControls("AK47 Gun", {
    position: { value: [-0.1, 0.4, 0.2], step: 0.1 },
  });
  const { muzzleFlashPosition } = useControls("Muzzle Flash", {
    muzzleFlashPosition: {
      value: [-0.1, 0.4, 0.6],
      step: 0.1,
      label: "Position Offset",
    },
  });

  const VOL_DISTANCE = cameraMode === "first-person" ? 0.03 : 0.1;

  const RESPAWN_HEIGHT = -10;
  const rigidBodyRef = useRef(null);

  const { positionX, positionY, positionZ } = {
    positionX: -14,
    positionY: 0,
    positionZ: 29.5,
  };

  const { bullets, fire, removeBullet } = useGame();
  const { camera } = useThree();
  const BULLET_SPEED = 100;
  const MAX_BULLET_DISTANCE = 600;
  const MAX_BULLETS = 30;

  useFrame((__, delta) => {
    if (rigidBodyRef.current) {
      handleCharacterRespawn(rigidBodyRef.current, [0, 20, 0], RESPAWN_HEIGHT);
    }

    if (shake > 0) {
      camera.position.x += Math.random() * shake * 0.1;
      camera.position.y += Math.random() * shake * 0.1;
      setShake(Math.max(0, shake - delta * 5));
    }
    // Update bullet positions
    bullets.forEach((bullet) => {
      bullet.position.addScaledVector(bullet.direction, BULLET_SPEED * delta);

      // Remove bullets that have traveled too far
      const distanceFromOrigin = bullet.position.distanceTo(camera.position);
      if (distanceFromOrigin > MAX_BULLET_DISTANCE) {
        removeBullet(bullet.id);
      }
    });
  });

  const handleFire = (button: number) => {
    if (button === 0) {
      if (isFirstPerson && bullets.length < MAX_BULLETS) {
        // Calculate gun position in world space
        const gunOffset = new Vector3(position[0], position[1], position[2]);

        // Apply camera rotation to gun offset
        gunOffset.applyQuaternion(camera.quaternion);

        // Calculate final gun position - adjust Y position to be slightly lower
        const gunPosition = new Vector3()
          .copy(camera.position)
          .add(gunOffset)
          .setY(camera.position.y - 0.01)
          .setX(camera.position.x - 0.075); // Lowered by 0.1 units, adjust this value as needed

        // Calculate direction based on camera's forward vector
        const direction = new Vector3(0, 0, -1);
        direction.applyQuaternion(camera.quaternion);

        // Create the bullet with aligned position and direction
        fire(camera, gunPosition, direction);

        setShowMuzzleFlash(true);
        setShake(1);
        if (shootSoundRef.current) {
          shootSoundRef.current?.play();
        }

        setTimeout(() => setShowMuzzleFlash(false), 250);
      }
    }
  };
  console.log(bullets);

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
      {isFirstPerson && <MouseController onMouseClick={handleFire} />}

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

      <Physics
        timeStep="vary"
        // debug={import.meta.env.DEV}
      >
        <DustMap scale={0.7} position={[positionX, positionY, positionZ]} />

        {/* Bullets */}
        {bullets.map((bullet) => (
          <group key={bullet.id}>
            <RigidBody
              type="fixed"
              position={[
                bullet.position.x,
                bullet.position.y,
                bullet.position.z,
              ]}
              colliders="ball"
              sensor
            >
              <mesh>
                <sphereGeometry args={[0.08]} />
                <meshBasicMaterial color="#ffff00" toneMapped={false} />
              </mesh>
              <Trail
                width={0.05}
                length={8}
                color={"#ffff00"}
                attenuation={(t) => t * t}
              />
            </RigidBody>
          </group>
        ))}

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
              {...(isFirstPerson
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
                key={cameraMode}
              >
                <MyCharacterModel
                  scale={0.9}
                  position={[0, -0.9, isFirstPerson ? -0.7 : 0]}
                  visible={!isFirstPerson}
                />
                {isFirstPerson && <AK47_GUN scale={4} position={position} />}
              </EcctrlAnimation>
              {isFirstPerson && (
                <>
                  <PositionalAudio
                    ref={shootSoundRef}
                    url="/audios/ak-47-gunshot.mp3"
                    distance={1}
                    loop={false}
                    autoplay={false}
                    setVolume={0.2}
                  />
                  {showMuzzleFlash && (
                    <pointLight
                      position={[
                        position[0] + muzzleFlashPosition[0],
                        position[1] + muzzleFlashPosition[1],
                        position[2] + muzzleFlashPosition[2],
                      ]}
                      intensity={3}
                      distance={2}
                      color="#ffff00"
                    />
                  )}
                </>
              )}
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
