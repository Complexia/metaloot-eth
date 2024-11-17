import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

const SpinningLoadingIcon: React.FC = () => {
  const ref = React.useRef<Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.1; // Adjust the rotation speed as desired
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -5]}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* <boxBufferGeometry args={[5, 5, 5]} /> */}
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

export default SpinningLoadingIcon;
