import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useEffect } from "react";

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

export function Map(props: JSX.IntrinsicElements["group"]) {
  const { scene, nodes, materials } = useGLTF(
    "/models/csgo_dust_2.glb"
  ) as GLTFResult;

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
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={1.719}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.025}>
          <mesh
            geometry={nodes.part11_part11_0.geometry}
            material={materials.part11}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.394}
          />
          <mesh
            geometry={nodes.part1_part1_0.geometry}
            material={materials.part1}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.394}
          />
          <mesh
            geometry={nodes.part2_part2_0.geometry}
            material={materials.part2}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.394}
          />
          <mesh
            geometry={nodes.part3_part3_0.geometry}
            material={materials.part3}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.394}
          />
          <mesh
            geometry={nodes.part4_part4_0.geometry}
            material={materials.part4}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.394}
          />
          <mesh
            geometry={nodes.part5_part5_0.geometry}
            material={materials.part5}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.394}
          />
          <mesh
            geometry={nodes.part6_part6_0.geometry}
            material={materials.part6}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.394}
          />
          <mesh
            geometry={nodes.part7_part7_0.geometry}
            material={materials.part7}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.394}
          />
          <mesh
            geometry={nodes.part8_part8_0.geometry}
            material={materials.part8}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.394}
          />
          <mesh
            geometry={nodes.part9_part9_0.geometry}
            material={materials.part9}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.394}
          />
          <mesh
            geometry={nodes.part10_part10_0.geometry}
            material={materials.part10}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.394}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/csgo_dust_2.glb");
