import React, { Suspense, useRef, useState, useEffect } from 'react';
import IronManModel from './IronMan';
import BlueLadyModel from './blueLady';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import SpinningLoadingIcon from './SpinningLoadingIcon';
import { RobotEve } from './robotEve';
import { PlayRobotModel } from './playGroundRobot';

interface ThreeComponentProps {
    chatBotState: string;
}

const ThreeComponent: React.FC<ThreeComponentProps> = ({ chatBotState }) => {

    const PlayRobotMyCamera = (): null => {
        const { camera } = useThree();
        // useFrame() Hook to update camera position in after render Canvas. From react-three/fiber
        useFrame(() => {
            camera.position.set(1, 15, 5.5);
            camera.lookAt(-0.5, 13, 0);
        });
        return null;
    };

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

    const RobotEveMyCamera = () => {
        const { camera } = useThree();
        useFrame(() => {
            camera.position.set(0, 5, 10);
            // camera.fov = 50;
            camera.updateProjectionMatrix();
            camera.lookAt(0, 2.25, 0);
        });
        return null; // This component does not render anything
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
        } else if (chatBotState === "0x08767863245463426") {
            return <RobotEve position={[0, -2, 3]} scale={[2, 2, 2]} />
        } else if (chatBotState === "0x0988777664667666") {
            return <PlayRobotModel position={[0, 6, -6]} scale={[6, 6, 6]}/>
        }
        //position={[0, -2, 3]} scale={[2, 2, 2]}
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
                ) : chatBotState === "0x08767863245463426" ? (
                    <>
                        <RobotEveMyCamera />
                        <ambientLight intensity={2} />
                        <pointLight position={[10, 10, 10]} intensity={100} />
                        <spotLight
                            position={[0, 10, 5]}
                            angle={0.3}
                            penumbra={1}
                            intensity={200}
                            castShadow
                        />
                        {/* <RobotEve position={[0, 0, 0]} scale={[1, 1, 1]} /> */}
                    </>

                ) : chatBotState === "0x0988777664667666" ? (
                    <>
                        <PlayRobotMyCamera />
                        <directionalLight intensity={2.5} position={[1, 3, 0.5]} />
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