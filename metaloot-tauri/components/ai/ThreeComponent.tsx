import React, { Suspense, useRef, useState, useEffect } from 'react';
import IronManModel from './IronMan';
import BlueLadyModel from './blueLady';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import SpinningLoadingIcon from './SpinningLoadingIcon';

interface ThreeComponentProps {
    chatBotState: string;
}

const ThreeComponent: React.FC<ThreeComponentProps> = ({ chatBotState }) => {

    // useThree to access camera props, and useFrame() to update attribution. From react-three/fiber
    const IronManCameraMyCamera = (): null => {
        const { camera } = useThree();
        // useFrame() Hook to update camera position in after render Canvas. From react-three/fiber
        useFrame(() => {
            camera.position.set(1, 15, 5.5);
            camera.lookAt(-0.5, 13, 0);
        });
        return null;
    };

    const BlueLadyModelMyCamera = (): null => {
        const { camera } = useThree();
        // useFrame() Hook to update camera position in after render Canvas. From react-three/fiber
        useFrame(() => {
            camera.position.set(0.15, 3.25, 0.75);
            camera.lookAt(0, 3.25, 0);
        });
        return null;
    };

    const renderModel = () => {
        if (chatBotState === "0x14588644555336") {
            return <IronManModel botState={chatBotState} />;
        } else if (chatBotState === "0x198888008772352") {
            return <BlueLadyModel botState={chatBotState} />;
        }
        console.log("not found")
        return null;
    };

    return (
        <Canvas flat={false} linear={false}>
            <Suspense fallback={<SpinningLoadingIcon />}>
                {chatBotState === "0x14588644555336" ? (
                    <>
                        <IronManCameraMyCamera />
                        <directionalLight intensity={2.5} position={[1, 3, 0.5]} />

                    </>
                ) : chatBotState === "0x198888008772352" ? (
                    <>
                        <BlueLadyModelMyCamera />
                        <directionalLight intensity={2.5} position={[1, 1, 0.5]} />
                    </>
                ) : null}
                {renderModel()}
            </Suspense>
            {/*<OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />*/}
        </Canvas>
    );
};

export default ThreeComponent;

{/* Document on React-Three/Fiber  link: https://docs.pmnd.rs/react-three-fiber/api/hooks */ }