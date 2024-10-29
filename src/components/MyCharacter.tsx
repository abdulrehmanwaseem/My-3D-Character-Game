import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF, SkeletonUtils } from "three-stdlib";
import { useControls } from "leva";

type ActionName =
  | "Armature|Take 001|BaseLayer"
  | "rp_nathan_animated_003_walking|Take 001|BaseLayer";

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    rp_nathan_animated_003_walking_geo001: THREE.Mesh;
    rp_nathan_animated_003_walking_geo: THREE.SkinnedMesh;
    rp_nathan_animated_003_walking_root: THREE.Bone;
  };
  materials: {
    Material_0: THREE.MeshStandardMaterial;
    rp_nathan_animated_003_mat: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

type CharacterModelProps = {
  animation: string;
} & JSX.IntrinsicElements["group"];

export function CharacterModel({ animation, ...props }: CharacterModelProps) {
  const group = useRef<THREE.Group | null>(null);
  const { scene, animations } = useGLTF("/models/My_3d_Character.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as GLTFResult;
  const { actions } = useAnimations(animations, group);

  const {
    shoulder_l,
    upperarm_l,
    lowerarm_l,
    hand_l,
    thumb_01_l,
    thumb_02_l,
    thumb_03_l,
    index_01_l,
    index_02_l,
    index_03_l,
    middle_01_l,
    middle_02_l,
    middle_03_l,
    ring_01_l,
    ring_02_l,
    ring_03_l,
    pinky_01_l,
    pinky_02_l,
    pinky_03_l,
    lowerarm_twist_l,
    upperarm_twist_l,
  } = useControls({
    shoulder_l: { value: 0, min: -1, max: 1 },
    upperarm_l: { value: 0, min: -1, max: 1 },
    lowerarm_l: { value: 0, min: -1, max: 1 },
    hand_l: { value: 0, min: -1, max: 1 },
    thumb_01_l: { value: 0, min: -1, max: 1 },
    thumb_02_l: { value: 0, min: -1, max: 1 },
    thumb_03_l: { value: 0, min: -1, max: 1 },
    index_01_l: { value: 0, min: -1, max: 1 },
    index_02_l: { value: 0, min: -1, max: 1 },
    index_03_l: { value: 0, min: -1, max: 1 },
    middle_01_l: { value: 0, min: -1, max: 1 },
    middle_02_l: { value: 0, min: -1, max: 1 },
    middle_03_l: { value: 0, min: -1, max: 1 },
    ring_01_l: { value: 0, min: -1, max: 1 },
    ring_02_l: { value: 0, min: -1, max: 1 },
    ring_03_l: { value: 0, min: -1, max: 1 },
    pinky_01_l: { value: 0, min: -1, max: 1 },
    pinky_02_l: { value: 0, min: -1, max: 1 },
    pinky_03_l: { value: 0, min: -1, max: 1 },
    lowerarm_twist_l: { value: 0, min: -1, max: 1 },
    upperarm_twist_l: { value: 0, min: -1, max: 1 },
  });

  useEffect(() => {
    if (!actions) return;

    const moveAction = actions["Armature|Take 001|BaseLayer"];
    const idleAction =
      actions["rp_nathan_animated_003_walking|Take 001|BaseLayer"];
    const FADE_DURATION = 0.25;
    if (animation === "move") {
      idleAction?.fadeOut(FADE_DURATION);
      moveAction?.reset().fadeIn(FADE_DURATION).play();
      return;
    } else if (animation === "idle") {
      moveAction?.fadeOut(FADE_DURATION);
      idleAction?.reset().fadeIn(FADE_DURATION).play();
    }
  }, [animation]);
  console.log(nodes);

  // useEffect(() => {
  //   nodes.shoulder_l.rotation.x = shoulder_l * Math.PI; // Adjust axis as needed
  //   nodes.upperarm_l.rotation.x = upperarm_l * Math.PI; // Adjust axis as needed
  //   nodes.lowerarm_l.rotation.x = lowerarm_l * Math.PI; // Adjust axis as needed
  //   nodes.hand_l.rotation.x = hand_l * Math.PI; // Adjust axis as needed

  //   // Similarly, update thumb and finger rotations if needed
  //   nodes.thumb_01_l.rotation.x = thumb_01_l * Math.PI;
  //   nodes.thumb_02_l.rotation.x = thumb_02_l * Math.PI;
  //   nodes.thumb_03_l.rotation.x = thumb_03_l * Math.PI;

  //   nodes.index_01_l.rotation.x = index_01_l * Math.PI;
  //   nodes.index_02_l.rotation.x = index_02_l * Math.PI;
  //   nodes.index_03_l.rotation.x = index_03_l * Math.PI;

  //   nodes.middle_01_l.rotation.x = middle_01_l * Math.PI;
  //   nodes.middle_02_l.rotation.x = middle_02_l * Math.PI;
  //   nodes.middle_03_l.rotation.x = middle_03_l * Math.PI;

  //   nodes.ring_01_l.rotation.x = ring_01_l * Math.PI;
  //   nodes.ring_02_l.rotation.x = ring_02_l * Math.PI;
  //   nodes.ring_03_l.rotation.x = ring_03_l * Math.PI;

  //   nodes.pinky_01_l.rotation.x = pinky_01_l * Math.PI;
  //   nodes.pinky_02_l.rotation.x = pinky_02_l * Math.PI;
  //   nodes.pinky_03_l.rotation.x = pinky_03_l * Math.PI;

  //   // Update twists
  //   nodes.lowerarm_twist_l.rotation.z = lowerarm_twist_l * Math.PI; // Adjust axis as needed
  //   nodes.upperarm_twist_l.rotation.z = upperarm_twist_l * Math.PI; // Adjust axis as needed
  // }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group
          name="rp_nathan_animated_003_walking001"
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        >
          <group name="rp_nathan_animated_003_walking_CTRL">
            <group name="Armature">
              <primitive object={nodes.rp_nathan_animated_003_walking_root} />
              <skinnedMesh
                name="rp_nathan_animated_003_walking_geo"
                geometry={nodes.rp_nathan_animated_003_walking_geo.geometry}
                material={materials.rp_nathan_animated_003_mat}
                skeleton={nodes.rp_nathan_animated_003_walking_geo.skeleton}
                castShadow
                receiveShadow
              />
            </group>
          </group>
          <group name="rp_nathan_animated_003_walking_geoGRP" />
        </group>
        <group
          name="rp_nathan_animated_003_walking"
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        >
          <group name="rp_nathan_animated_003_walking_CTRL001" />
          <group name="rp_nathan_animated_003_walking_geoGRP001" />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/My_3d_Character.glb");
