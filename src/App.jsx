import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  CubeCamera,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import "./style.css";
import { Ground } from "./Ground";
import Car from "./Car";
import Rings from "./Rings"
import { Boxes } from './Boxes'
import { FloatingGrid } from "./FloatingGrid";
import { Physics } from "@react-three/cannon";
import { ColliderBox } from "./ColliderBox";

function CarShow() {
  const [thirdPerson, setThirdPerson] = useState(false);
  const [cameraPosition, setCameraPosition] = useState([-20, 20, 20]);

  useEffect(() => {
    function keydownHandler(e) {
      if (e.key === "k") {
        // random is necessary to trigger a state change
        if(thirdPerson) setCameraPosition([-20, 20, 20 + Math.random() * 0.1]);
        setThirdPerson(!thirdPerson); 
      }
    }

    window.addEventListener("keydown", keydownHandler);
    return () => window.removeEventListener("keydown", keydownHandler);
  }, [thirdPerson]);
  return (
    <>
      <PerspectiveCamera makeDefault position={cameraPosition} fov={40} />
      {!thirdPerson && (
        <OrbitControls target={[-2.64, -0.71, 0.03]} maxPolarAngle={1.45}/>
      )}
      <color args={[0, 0, 0]} attach='background' />


      <spotLight
        color={[1, 0.25, 0.7]}
        intensity={15}
        angle={0.6}
        penumbra={0.5}
        position={[65, 65, 65]}
        castShadow
        shadow-bias={-0.0001}
      />
      {/* <spotLight
        color={[0.14, 0.5, 1]}
        intensity={2}
        angle={0.6}
        penumbra={0.5}
        position={[-5, 5, 0]}
        castShadow
        shadow-bias={-0.0001}
      /> */}
      <Ground />

      {/* <CubeCamera resolution={256} frames={Infinity}>
        {texture => (
          <>
            <Environment map={texture} />
            <Car thirdPerson={thirdPerson}/>
          </>
        )
        }
      </CubeCamera> */}
      <Car thirdPerson={thirdPerson}/>


      {/* <Rings /> */}
      <Boxes positionX={-15}/>
      <Boxes positionX={15}/>
      <Boxes/>
      {/* <FloatingGrid/> */}
      <ColliderBox position={[-52, 0, 0]} scale={[2, 100, 100]}/>
      {/* <mesh position={[-52, 0, 0]}>
        <boxGeometry args={[2, 100, 100]} />
        <meshBasicMaterial color='hotpink' />
      </mesh> */}

      <ColliderBox position={[52, 0, 0]} scale={[2, 100, 100]}/>
      {/* <mesh position={[52, 0, 0]}>
        <boxGeometry args={[2, 100, 100]} />
        <meshBasicMaterial color='hotpink' />
      </mesh> */}

      <ColliderBox position={[0, 0, 52]} scale={[100, 100, 2]}/>
      {/* <mesh position={[0, 0, 52]}>
        <boxGeometry args={[100, 100, 2]} />
        <meshBasicMaterial color='hotpink' />
      </mesh> */}

      <ColliderBox position={[0, 0, -52]} scale={[100, 100, 2]}/>
      {/* <mesh position={[0, 0, -52]}>
        <boxGeometry args={[100, 100, 2]} />
        <meshBasicMaterial color='hotpink' />
      </mesh> */}
    </>
  );
}

function App() {
  return (
    <Suspense fallback={null}>
      <Canvas shadows>
        <Physics
          broadphase="SAP"
          gravity={[0, -5, 0]}
        >
          <CarShow />
        </Physics>
      </Canvas>
    </Suspense>
  );
}

export default App;
