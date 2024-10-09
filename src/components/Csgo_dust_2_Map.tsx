import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useEffect, useRef } from "react";
import { RigidBody } from "@react-three/rapier";

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
  const { scene } = useGLTF("/models/Csgo_Dust_2.glb") as GLTFResult;

  const group = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive {...props} object={scene} ref={group} />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/models/Csgo_Dust_2.glb");
