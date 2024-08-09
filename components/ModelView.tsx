'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import useStore from '@/store/useStore';
import { createDrawerModel } from '@/lib/createDrawerModel';
import { createGridModel } from '@/lib/createGridModel';

interface ModelViewProps {
    gridRef: React.RefObject<THREE.Group | null>;
}

const ModelView: React.FC<ModelViewProps> = ({ gridRef }) => {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const { width, height, depth, xSections, ySections, wallThickness, color } =
        useStore();
    const drawerRef = useRef<THREE.Group | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        sceneRef.current = scene;
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

        const gridGroup = new THREE.Group();
        gridRef.current = gridGroup;
        scene.add(gridGroup);

        const drawerGroup = new THREE.Group();
        drawerRef.current = drawerGroup;
        scene.add(drawerGroup);

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
    }, []);

    useEffect(() => {
        if (gridRef.current && drawerRef.current) {
            const scene = sceneRef.current;
            gridRef.current.clear();
            drawerRef.current.clear();

            createGridModel(
                gridRef.current,
                width,
                height,
                depth,
                xSections,
                ySections,
                wallThickness,
                color
            );

            createDrawerModel(drawerRef.current, width, height, depth);
        }
    }, [width, height, depth, xSections, ySections, wallThickness, color]);

    return <div ref={mountRef} />;
};

export default ModelView;
