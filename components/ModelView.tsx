'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import useStore from '@/store/useStore';
import { createDrawerModel } from '@/lib/createDrawerModel';
import { createGridModel } from '@/lib/createGridModel';

interface ModelViewProps {
    gridRef: React.RefObject<THREE.Group>;
}

const ModelView: React.FC<ModelViewProps> = ({ gridRef }) => {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const {
        width,
        height,
        depth,
        xSections,
        ySections,
        wallThickness,
        color,
        gridMatrix,
    } = useStore();

    const drawerRef = useRef<THREE.Group>(new THREE.Group());
    const sceneRef = useRef<THREE.Scene>(new THREE.Scene());

    useEffect(() => {
        const scene = sceneRef.current;

        if (!gridRef.current) {
            console.error('gridRef.current is not initialized');
            return;
        }

        const camera = new THREE.PerspectiveCamera(75, 2 / 3, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        renderer.setSize((window.innerWidth * 2) / 3, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(2, 2, 2).normalize();
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        scene.add(gridRef.current);
        scene.add(drawerRef.current);

        camera.position.set(200, 200, 200);
        camera.lookAt(scene.position);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [gridRef, drawerRef]);

    useEffect(() => {
        if (gridRef.current && drawerRef.current) {
            gridRef.current.clear();
            drawerRef.current.clear();

            if (gridMatrix && gridMatrix.length > 0) {
                createGridModel(
                    gridRef.current,
                    width,
                    height,
                    depth,
                    xSections,
                    ySections,
                    wallThickness,
                    color,
                    gridMatrix
                );
            }

            createDrawerModel(drawerRef.current, width, height, depth);
        }
    }, [
        width,
        height,
        depth,
        xSections,
        ySections,
        wallThickness,
        color,
        gridMatrix,
    ]);

    return <div ref={mountRef} />;
};

export default ModelView;
