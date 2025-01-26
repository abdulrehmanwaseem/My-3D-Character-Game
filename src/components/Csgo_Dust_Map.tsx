import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    part11_part11_0: THREE.Mesh;
    part1_part1_0: THREE.Mesh;
    part2_part2_0: THREE.Mesh;
    part3_part3_0: THREE.Mesh;
    part4_part4_0: THREE.Mesh;
    part5_part5_0: THREE.Mesh;
    part6_part6_0: THREE.Mesh;
    part7_part7_0: THREE.Mesh;
    part8_part8_0: THREE.Mesh;
    part9_part9_0: THREE.Mesh;
    part10_part10_0: THREE.Mesh;
  };
  materials: {
    part11: THREE.MeshBasicMaterial;
    part1: THREE.MeshBasicMaterial;
    part2: THREE.MeshBasicMaterial;
    part3: THREE.MeshBasicMaterial;
    part4: THREE.MeshBasicMaterial;
    part5: THREE.MeshBasicMaterial;
    part6: THREE.MeshBasicMaterial;
    part7: THREE.MeshBasicMaterial;
    part8: THREE.MeshBasicMaterial;
    part9: THREE.MeshBasicMaterial;
    part10: THREE.MeshBasicMaterial;
  };
  animations: THREE.AnimationAction[];
};

export function DustMap(props: JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF("/models/Csgo_Dust_Map.glb") as GLTFResult;
  const group = useRef();

  return (
    <group castShadow receiveShadow>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive {...props} object={scene} ref={group} />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/models/Csgo_Dust_Map.glb");
