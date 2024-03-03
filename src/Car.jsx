import { useBox, useRaycastVehicle } from '@react-three/cannon'
import { useFrame, useLoader } from '@react-three/fiber'
import React, { useEffect, useRef } from 'react'
import { Mesh, Quaternion, Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useWheels } from './useWheels'
import { useControls } from './useControls'
import { WheelDebug } from './WheelDebug'

const Car = ({ thirdPerson }) => {
  const gltf = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + 'models/car/scene.gltf'
  )

  useEffect(() => {
    gltf.scene.scale.set(0.005, 0.005, 0.005);
    gltf.scene.position.set(0, -1, 0);
    gltf.scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.envMapIntensity = 20;
      }
    });
  }, [gltf]);

  useFrame((state) => {
    if(!thirdPerson) return;

    let position = new Vector3(0,0,0);
    position.setFromMatrixPosition(chassisBody.current.matrixWorld);

    let quaternion = new Quaternion(0, 0, 0, 0);
    quaternion.setFromRotationMatrix(chassisBody.current.matrixWorld);

    let wDir = new Vector3(0,0,1);
    wDir.applyQuaternion(quaternion);
    wDir.normalize();

    let cameraPosition = position.clone().add(wDir.clone().multiplyScalar(10).add(new Vector3(0, 2, 0)));
    
    wDir.add(new Vector3(0, 0.2, 0));
    state.camera.position.copy(cameraPosition);
    state.camera.lookAt(position);
  });

  const position = [-1.5, 0.5, 3];
  const width = 3;
  const height = 1.4;
  const front = 3;
  const wheelRadius = 1.5;

  const chassisBodyArgs = [width, height, front * 2];
  const [chassisBody, chassisApi] = useBox(
    () => ({
      args: chassisBodyArgs,
      mass: 150,
      position,
    }),
    useRef(null),
  );

  const [wheels, wheelInfos] = useWheels(width, height, front, wheelRadius);

  const [vehicle, vehicleApi] = useRaycastVehicle(
    () => ({
      chassisBody,
      wheelInfos,
      wheels,
    }),
    useRef(null),
  );

  useControls(vehicleApi, chassisApi);


  // useFrame((state, delta) => {
  //   let t = state.clock.getElapsedTime();

  //   let group = gltf.scene.children[0].children[0].children[0];
  //   group.children[0].rotation.x = t * 2;
  //   group.children[2].rotation.x = t * 2;
  //   group.children[4].rotation.x = t * 2;
  //   group.children[6].rotation.x = t * 2;
  // });
  return (
    // <group ref={vehicle} name='vehicle'>
    //     <primitive object={gltf.scene}/>
      
    //   <mesh ref={chassisBody}>
    //     <meshBasicMaterial transparent={true} opacity={0.3}/>
    //     <boxGeometry args={chassisBodyArgs}/>
    //   </mesh>

    //   <WheelDebug wheelRef={wheels[0]} radius={wheelRadius} />
    //   <WheelDebug wheelRef={wheels[1]} radius={wheelRadius} />
    //   <WheelDebug wheelRef={wheels[2]} radius={wheelRadius} />
    //   <WheelDebug wheelRef={wheels[3]} radius={wheelRadius} />
    // </group>
    <group ref={vehicle} name="vehicle">
    <group ref={chassisBody} name="chassisBody">
      <primitive object={gltf.scene} rotation-y={Math.PI}/>
    </group>
    
    {/* <mesh ref={chassisBody}>
      <meshBasicMaterial transparent={true} opacity={0.8} />
      <boxGeometry args={chassisBodyArgs} />
    </mesh> */}

    <WheelDebug wheelRef={wheels[0]} radius={wheelRadius} />
    <WheelDebug wheelRef={wheels[1]} radius={wheelRadius} />
    <WheelDebug wheelRef={wheels[2]} radius={wheelRadius} />
    <WheelDebug wheelRef={wheels[3]} radius={wheelRadius} />
  </group>
  )
}

export default Car