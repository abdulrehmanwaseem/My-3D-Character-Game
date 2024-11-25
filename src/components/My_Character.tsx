import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF, SkeletonUtils } from "three-stdlib";

type ActionName =
  | "Armature|Take 001|BaseLayer.001 Retarget"
  | "Target.001|Target|Action"
  | "Target.001|Target|Action.001"
  | "Target.001|Target|Armature|Take 001|BaseLayer"
  | "Target.001|Target|Armature|Take 001|BaseLayer.001"
  | "Target.001|Target|Armature|Take 001|BaseLayer.001 Retarget"
  | "Target.001|Target|Armature|Take 001|BaseLayer.001 Retarget.001"
  | "Target.001|Target|Armature|Take 001|BaseLayer.001 Retarget_"
  | "Target.001|Target|Armature|Take 001|BaseLayer.001 Retarget_.001"
  | "Target.001|Target|Armature|Take 001|BaseLayer.001 Retarget_Targ"
  | "Target.001|Target|Armature|Take 001|BaseLayer.001_Target.001"
  | "Target.001|Target|Armature|Take 001|BaseLayer.001_Target.001_Ta"
  | "Target.001|Target|Armature|Take 001|BaseLayer.001_Target.002";

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    Body: THREE.SkinnedMesh;
    Mesh_0: THREE.SkinnedMesh;
    rp_nathan_animated_003_walking_root: THREE.Bone;
  };
  materials: {
    rp_nathan_animated_003_mat: THREE.MeshStandardMaterial;
    ["Material_0.002"]: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

type CharacterModelProps = {
  animation: string;
} & JSX.IntrinsicElements["group"];

export function MyCharacterModel({ animation, ...props }: CharacterModelProps) {
  const group = useRef<THREE.Group | null>(null);
  const { scene, animations } = useGLTF("/models/My_Character.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions) return;

    const moveAction = actions["Armature|Take 001|BaseLayer.001 Retarget"];
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

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Target">
          <primitive object={nodes.rp_nathan_animated_003_walking_root} />
          <skinnedMesh
            name="Body"
            geometry={nodes.Body.geometry}
            material={materials.rp_nathan_animated_003_mat}
            skeleton={nodes.Body.skeleton}
          />
          <skinnedMesh
            name="Mesh_0"
            geometry={nodes.Mesh_0.geometry}
            material={materials["Material_0.002"]}
            skeleton={nodes.Mesh_0.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/My_Character.glb");
