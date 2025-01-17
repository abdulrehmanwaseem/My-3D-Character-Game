import { useGLTF } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import React from "react";
import * as THREE from "three";
import { GLTF, SkeletonUtils } from "three-stdlib";

type ActionName = "Dying" | "Idle" | "Jump" | "Sprint" | "Walk";

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    Body: THREE.SkinnedMesh;
    Head: THREE.SkinnedMesh;
    mixamorigHips: THREE.Bone;
    Ctrl_Master: THREE.Bone;
    Ctrl_ArmPole_IK_Left: THREE.Bone;
    Ctrl_Hand_IK_Left: THREE.Bone;
    Ctrl_ArmPole_IK_Right: THREE.Bone;
    Ctrl_Hand_IK_Right: THREE.Bone;
    Ctrl_Foot_IK_Left: THREE.Bone;
    Ctrl_LegPole_IK_Left: THREE.Bone;
    Ctrl_Foot_IK_Right: THREE.Bone;
    Ctrl_LegPole_IK_Right: THREE.Bone;
  };
  materials: {
    Body: THREE.MeshStandardMaterial;
    Head: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export function MyCharacterModel({ ...props }: JSX.IntrinsicElements["group"]) {
  const group = React.useRef<THREE.Group>(null!);
  const { scene } = useGLTF("/models/My_Character.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as GLTFResult;

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Character">
          <primitive object={nodes.mixamorigHips} />
          <primitive object={nodes.Ctrl_Master} />
          <primitive object={nodes.Ctrl_ArmPole_IK_Left} />
          <primitive object={nodes.Ctrl_Hand_IK_Left} />
          <primitive object={nodes.Ctrl_ArmPole_IK_Right} />
          <primitive object={nodes.Ctrl_Hand_IK_Right} />
          <primitive object={nodes.Ctrl_Foot_IK_Left} />
          <primitive object={nodes.Ctrl_LegPole_IK_Left} />
          <primitive object={nodes.Ctrl_Foot_IK_Right} />
          <primitive object={nodes.Ctrl_LegPole_IK_Right} />
          <skinnedMesh
            name="Body"
            geometry={nodes.Body.geometry}
            material={materials.Body}
            skeleton={nodes.Body.skeleton}
          />
          <skinnedMesh
            name="Head"
            geometry={nodes.Head.geometry}
            material={materials.Head}
            skeleton={nodes.Head.skeleton}
          />
        </group>
        <group name="cs_grp">
          <group name="cs_arm_fk" position={[1.5, 8.5, 0]} scale={0.822} />
          <group name="cs_calf_fk" position={[0.5, 8.5, 0]} scale={0.822} />
          <group name="cs_circle" position={[0.5, 4.5, 0]} scale={0.206} />
          <group name="cs_circle001" />
          <group name="cs_circle_025" position={[2.5, 4.5, 0]} scale={0.206} />
          <group
            name="cs_foot"
            position={[0.5, 10.5, 0]}
            rotation={[-Math.PI, 0, 0]}
            scale={0.308}
          />
          <group name="cs_foot001" />
          <group name="cs_foot002" />
          <group
            name="cs_foot_01"
            position={[0.5, 18.5, 0]}
            rotation={[0, Math.PI / 2, 0]}
            scale={2.186}
          />
          <group name="cs_foot_roll" position={[0.5, 12.5, 0]} scale={0.592} />
          <group name="cs_forearm_fk" position={[2.5, 8.5, 0]} scale={0.822} />
          <group
            name="cs_hand"
            position={[0.5, 19.5, 0]}
            rotation={[-Math.PI, 0, 0]}
            scale={0.308}
          />
          <group name="cs_head" position={[0.5, 13.5, 0]} scale={0.206} />
          <group name="cs_hips" position={[0.5, 11.5, 0]} scale={0.206} />
          <group name="cs_master" position={[0.5, 17.5, 0]} scale={0.1} />
          <group name="cs_neck" position={[0.5, 14.5, 0]} scale={0.206} />
          <group
            name="cs_shoulder_left"
            position={[0.5, 15.5, 0]}
            rotation={[-Math.PI, -Math.PI / 2, 0]}
            scale={1.038}
          />
          <group
            name="cs_shoulder_right"
            position={[0.5, 16.5, 0]}
            rotation={[-Math.PI, -Math.PI / 2, 0]}
            scale={1.038}
          />
          <group name="cs_sphere" />
          <group name="cs_sphere_012" position={[3.5, 2.5, 0]} scale={0.206} />
          <group name="cs_square" />
          <group
            name="cs_square_2"
            position={[0.5, 1.497, 0]}
            rotation={[-Math.PI, 0, 0]}
            scale={0.154}
          />
          <group name="cs_thigh_fk" position={[0.5, 7.5, 0]} scale={0.822} />
          <group name="cs_toe" position={[0.5, 9.5, 0]} scale={0.429} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/My_Character.glb");
