import {
  Environment,
  KeyboardControls,
  OrbitControls,
  OrthographicCamera,
  PositionalAudio,
  Sky,
  Trail,
  useGLTF,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { useControls } from "leva";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { Audio, Vector3 } from "three";
import { AnimationSet, KeyboardControl, SceneProps } from "../types";
import { handleCharacterRespawn } from "../utils/helper";
import { AK47_GUN } from "./Ak47_GUN";
import { DustMap } from "./Csgo_Dust_Map";
import MouseController from "./MouseController";
import { MyCharacterModel } from "./MyCharacter";
import { useGame } from "./useGame";

// Constants
const BULLET_CONFIG = {
  SPEED: 150,
  MAX_DISTANCE: 1000,
  MAX_COUNT: 30,
  COOLDOWN: 900, 
  SIZE: 0.9,
  TRAIL_WIDTH: 0.05,
  TRAIL_LENGTH: 8,
  COLOR: "#ffff00",
} as const;

const CAMERA_CONFIG = {
  FIRST_PERSON: {
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
  },
  THIRD_PERSON: {
    camInitDis: -3.5,
    camMaxDis: -6,
    camMinDis: -1,
    camUpLimit: 1.2,
    camLowLimit: -0.8,
    camInitDir: { x: 0.2, y: 0 },
  },
} as const;

const Scene = ({
  cameraMode,
  players = [],
  isFirstPerson = false,
}: SceneProps) => {
  // Refs
  const rigidBodyRef = useRef(null);
  const shootSoundRef = useRef<Audio>(null);
  const lastShootTime = useRef(0);

  // State
  const [showMuzzleFlash, setShowMuzzleFlash] = useState(false);
  const [cameraShake, setCameraShake] = useState(0);

  // Hooks
  const { camera } = useThree();
  const { bullets, fire, removeBullet } = useGame();

  // Controls
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

  // Memoized values
  const VOL_DISTANCE = useMemo(
    () => (cameraMode === "first-person" ? 0.03 : 0.1),
    [cameraMode]
  );

  const spawnPosition = useMemo(() => new Vector3(0, 20, 0), []);

  const keyboardMap = useMemo<KeyboardControl[]>(
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

  const animationSet: AnimationSet = useMemo(
    () => ({
      idle: "Idle",
      walk: "Walk",
      run: "Sprint",
      jump: "Jump",
      jumpIdle: "Jump",
      jumpLand: "Idle",
      fall: "Jump",
      action1: "Dying",
    }),
    []
  );

  // Preload character model
  useGLTF("/models/My_Character.glb");

  // Handle firing logic
  const handleFire = useCallback(
    (button: number) => {
      if (
        button !== 0 ||
        !isFirstPerson ||
        bullets.length >= BULLET_CONFIG.MAX_COUNT
      )
        return;

      const now = performance.now();
      if (now - lastShootTime.current < BULLET_CONFIG.COOLDOWN) return;

      lastShootTime.current = now;

      const gunOffset = new Vector3(...position);
      gunOffset.applyQuaternion(camera.quaternion);

      const gunPosition = new Vector3()
        .copy(camera.position)
        .add(gunOffset)
        .setY(camera.position.y - 0.01)
        .setX(camera.position.x - 0.075);

      const direction = new Vector3(0, 0, -1).applyQuaternion(
        camera.quaternion
      );

      fire(camera, gunPosition, direction);
      shootSoundRef.current?.play();

      setShowMuzzleFlash(true);
      setCameraShake(0.6);

      setTimeout(() => setShowMuzzleFlash(false), 150);
    },
    [bullets.length, camera, fire, isFirstPerson, position]
  );

  // Frame updates
  useFrame((_, delta) => {
    // Handle respawn
    if (rigidBodyRef.current) {
      handleCharacterRespawn(rigidBodyRef.current, spawnPosition, -10);
    }

    // Camera shake
    if (cameraShake > 0) {
      const shakeAmount = cameraShake * 0.1;
      camera.position.x += (Math.random() - 0.5) * shakeAmount;
      camera.position.y += (Math.random() - 0.5) * shakeAmount;
      setCameraShake(Math.max(0, cameraShake - delta * 5));
    }

    // Update bullets
    bullets.forEach((bullet) => {
      bullet.position.addScaledVector(
        bullet.direction,
        BULLET_CONFIG.SPEED * delta
      );

      if (
        bullet.position.distanceTo(camera.position) > BULLET_CONFIG.MAX_DISTANCE
      ) {
        removeBullet(bullet.id);
      }
    });
  });

  return (
    <>
      <OrbitControls autoRotate maxPolarAngle={Math.PI / 2} />
      {isFirstPerson && <MouseController onMouseClick={handleFire} />}

      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <Sky sunPosition={[100, 20, 100]} />

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
        <DustMap scale={0.7} position={[-14, 0, 29.5]} />

        {/* Bullets */}
        {bullets.map((bullet) => (
          <RigidBody
            key={bullet.id}
            type="fixed"
            position={[bullet.position.x, bullet.position.y, bullet.position.z]}
            colliders="ball"
            sensor
          >
            <Trail
              width={BULLET_CONFIG.TRAIL_WIDTH}
              length={BULLET_CONFIG.TRAIL_LENGTH}
              color={BULLET_CONFIG.COLOR}
              attenuation={(t) => t * t}
            >
              <mesh>
                <sphereGeometry args={[BULLET_CONFIG.SIZE]} />
                <meshBasicMaterial
                  color={BULLET_CONFIG.COLOR}
                  toneMapped={false}
                />
              </mesh>
            </Trail>
          </RigidBody>
        ))}

        <KeyboardControls map={keyboardMap}>
          <Suspense fallback={null}>
            <Ecctrl
              ref={rigidBodyRef}
              key={cameraMode}
              animated
              position={spawnPosition}
              capsuleHalfHeight={0.5}
              capsuleRadius={0.32}
              floatHeight={0.12}
              jumpVel={3}
              maxVelLimit={3}
              moveImpulsePointY={0}
              autoBalanceSpringK={0.7}
              autoBalanceDampingC={0.08}
              slopeMaxAngle={0.8}
              slopeUpExtraForce={0.05}
              slopeDownExtraForce={0.1}
              {...(isFirstPerson
                ? CAMERA_CONFIG.FIRST_PERSON
                : CAMERA_CONFIG.THIRD_PERSON)}
            >
              <EcctrlAnimation
                characterURL="/models/My_Character.glb"
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
                      color={BULLET_CONFIG.COLOR}
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
          <RigidBody position={[5, 3, 5]} canSleep={false}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color="cyan"
                emissive="cyan"
                emissiveIntensity={1}
                metalness={0.2}
                roughness={0.1}
                transparent
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
