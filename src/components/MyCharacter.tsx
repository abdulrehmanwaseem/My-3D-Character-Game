import * as THREE from "three";
import React, { useEffect } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF, SkeletonUtils } from "three-stdlib";

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
  animation: boolean;
} & JSX.IntrinsicElements["group"];

export function CharacterModel({
  animation = false,
  ...props
}: CharacterModelProps) {
  const group = React.useRef<THREE.Group>();
  const { scene, animations } = useGLTF("/models/My_3d_Character.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      const action = actions["Armature|Take 001|BaseLayer"];
      if (animation && action) {
        action.play();
      } else if (action) {
        action.stop();
      }
    }

    return () => {
      if (actions && actions["Armature|Take 001|BaseLayer"]) {
        actions["Armature|Take 001|BaseLayer"].stop();
      }
    };
  }, [actions, animation]);

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
