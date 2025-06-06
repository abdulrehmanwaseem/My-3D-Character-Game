import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    pCube10: THREE.Mesh;
    pCube11: THREE.Mesh;
    pCube12: THREE.Mesh;
    pCube3: THREE.Mesh;
    pCube5: THREE.Mesh;
    polySurface1: THREE.Mesh;
    polySurface4: THREE.Mesh;
    polySurface5: THREE.Mesh;
    pSphere10: THREE.Mesh;
    pSphere11: THREE.Mesh;
    pSphere12: THREE.Mesh;
    pSphere13: THREE.Mesh;
    pSphere14: THREE.Mesh;
    pSphere15: THREE.Mesh;
    pSphere2: THREE.Mesh;
    pSphere3: THREE.Mesh;
    pSphere4: THREE.Mesh;
    pSphere5: THREE.Mesh;
    pSphere6: THREE.Mesh;
    pSphere7: THREE.Mesh;
    pSphere8: THREE.Mesh;
    pSphere9: THREE.Mesh;
    firing: THREE.Mesh;
    pCube8: THREE.Mesh;
    pCylinder3: THREE.Mesh;
    pCylinder4: THREE.Mesh;
    pCube14: THREE.Mesh;
    trigger: THREE.Mesh;
    frontGrip: THREE.Mesh;
    handGrip: THREE.Mesh;
    sholder: THREE.Mesh;
    woodPartFront: THREE.Mesh;
  };
  materials: {
    matelMat: THREE.MeshStandardMaterial;
    woodMat: THREE.MeshStandardMaterial;
  };
  animations: [];
};

export function AK47_GUN(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/models/Ak47_GUN.glb") as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh geometry={nodes.pCube10.geometry} material={materials.matelMat} />
        <mesh geometry={nodes.pCube11.geometry} material={materials.matelMat} />
        <mesh geometry={nodes.pCube12.geometry} material={materials.matelMat} />
        <mesh geometry={nodes.pCube3.geometry} material={materials.matelMat} />
        <mesh geometry={nodes.pCube5.geometry} material={materials.matelMat} />
        <mesh
          geometry={nodes.polySurface1.geometry}
          material={materials.matelMat}
        />
        <mesh
          geometry={nodes.polySurface4.geometry}
          material={materials.matelMat}
        />
        <mesh
          geometry={nodes.polySurface5.geometry}
          material={materials.matelMat}
        />
        <mesh
          geometry={nodes.pSphere10.geometry}
          material={materials.matelMat}
          rotation={[-Math.PI, 0, 0]}
          scale={-1}
        />
        <mesh
          geometry={nodes.pSphere11.geometry}
          material={materials.matelMat}
          rotation={[-Math.PI, 0, 0]}
          scale={-1}
        />
        <mesh
          geometry={nodes.pSphere12.geometry}
          material={materials.matelMat}
          rotation={[-Math.PI, 0, 0]}
          scale={-1}
        />
        <mesh
          geometry={nodes.pSphere13.geometry}
          material={materials.matelMat}
          rotation={[-Math.PI, 0, 0]}
          scale={-1}
        />
        <mesh
          geometry={nodes.pSphere14.geometry}
          material={materials.matelMat}
          rotation={[-Math.PI, 0, 0]}
          scale={-1}
        />
        <mesh
          geometry={nodes.pSphere15.geometry}
          material={materials.matelMat}
          rotation={[-Math.PI, 0, 0]}
          scale={-1}
        />
        <mesh
          geometry={nodes.pSphere2.geometry}
          material={materials.matelMat}
        />
        <mesh
          geometry={nodes.pSphere3.geometry}
          material={materials.matelMat}
        />
        <mesh
          geometry={nodes.pSphere4.geometry}
          material={materials.matelMat}
        />
        <mesh
          geometry={nodes.pSphere5.geometry}
          material={materials.matelMat}
        />
        <mesh
          geometry={nodes.pSphere6.geometry}
          material={materials.matelMat}
        />
        <mesh
          geometry={nodes.pSphere7.geometry}
          material={materials.matelMat}
        />
        <mesh
          geometry={nodes.pSphere8.geometry}
          material={materials.matelMat}
        />
        <mesh
          geometry={nodes.pSphere9.geometry}
          material={materials.matelMat}
          rotation={[-Math.PI, 0, 0]}
          scale={-1}
        />
        <mesh geometry={nodes.firing.geometry} material={materials.matelMat} />
        <mesh geometry={nodes.pCube8.geometry} material={materials.matelMat} />
        <mesh
          geometry={nodes.pCylinder3.geometry}
          material={materials.matelMat}
        />
        <mesh
          geometry={nodes.pCylinder4.geometry}
          material={materials.matelMat}
        >
          <mesh
            geometry={nodes.pCube14.geometry}
            material={materials.matelMat}
          />
        </mesh>
        <mesh geometry={nodes.trigger.geometry} material={materials.matelMat} />
        <mesh
          geometry={nodes.frontGrip.geometry}
          material={materials.woodMat}
        />
        <mesh geometry={nodes.handGrip.geometry} material={materials.woodMat} />
        <mesh geometry={nodes.sholder.geometry} material={materials.woodMat} />
        <mesh
          geometry={nodes.woodPartFront.geometry}
          material={materials.woodMat}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/Ak47_GUN.glb");
