'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { saveAs } from 'file-saver';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';

import Sidebar from '@/components/Sidebar';
import useStore from '@/store/useStore';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';

export default function Home() {
    const mountRef = useRef(null);
    const { width, height, depth, xSections, ySections, wallThickness, color } =
        useStore();
    const gridRef = useRef<THREE.Group | null>(null);
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

            const sectionWidth = width / (xSections + 1);
            const sectionDepth = depth / (ySections + 1);

            // Add the grid bars
            for (let i = 1; i <= xSections; i++) {
                const geometry = new THREE.BoxGeometry(
                    wallThickness,
                    height,
                    depth
                );
                const material = new THREE.MeshBasicMaterial({ color });
                const bar = new THREE.Mesh(geometry, material);
                bar.position.x = -width / 2 + i * sectionWidth;
                gridRef.current.add(bar);

                const edges = new THREE.EdgesGeometry(geometry);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                });
                const line = new THREE.LineSegments(edges, lineMaterial);
                line.position.copy(bar.position);
                gridRef.current.add(line);
            }

            for (let j = 1; j <= ySections; j++) {
                const geometry = new THREE.BoxGeometry(
                    width,
                    height,
                    wallThickness
                );
                const material = new THREE.MeshBasicMaterial({ color });
                const bar = new THREE.Mesh(geometry, material);
                bar.position.z = -depth / 2 + j * sectionDepth;
                gridRef.current.add(bar);

                const edges = new THREE.EdgesGeometry(geometry);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                });
                const line = new THREE.LineSegments(edges, lineMaterial);
                line.position.copy(bar.position);
                gridRef.current.add(line);
            }

            // Add the drawer model
            addDrawerModel(drawerRef.current, width, height, depth);
        }
    }, [width, height, depth, xSections, ySections, wallThickness, color]);

    const addDrawerModel = (
        drawerGroup: THREE.Group,
        width: number,
        height: number,
        depth: number
    ) => {
        const drawerThickness = 5;
        const drawerMaterial = new THREE.MeshBasicMaterial({ color: 0xd3d3d3 });

        const bottomGeometry = new THREE.BoxGeometry(
            width + drawerThickness * 2,
            drawerThickness,
            depth + drawerThickness * 2
        );
        const bottom = new THREE.Mesh(bottomGeometry, drawerMaterial);
        bottom.position.y = -height / 2 - drawerThickness / 2;
        drawerGroup.add(bottom);

        // Left side
        const leftGeometry = new THREE.BoxGeometry(
            drawerThickness,
            height + drawerThickness,
            depth + drawerThickness * 2
        );
        const leftSide = new THREE.Mesh(leftGeometry, drawerMaterial);
        leftSide.position.x = -width / 2 - drawerThickness / 2;
        drawerGroup.add(leftSide);

        // Right side
        const rightGeometry = new THREE.BoxGeometry(
            drawerThickness,
            height + drawerThickness,
            depth + drawerThickness * 2
        );
        const rightSide = new THREE.Mesh(rightGeometry, drawerMaterial);
        rightSide.position.x = width / 2 + drawerThickness / 2;
        drawerGroup.add(rightSide);

        // Back side
        const backGeometry = new THREE.BoxGeometry(
            width + drawerThickness * 2,
            height + drawerThickness,
            drawerThickness
        );
        const backSide = new THREE.Mesh(backGeometry, drawerMaterial);
        backSide.position.z = -depth / 2 - drawerThickness / 2;
        drawerGroup.add(backSide);

        // Front side
        const frontGeometry = new THREE.BoxGeometry(
            width + drawerThickness * 2,
            height + drawerThickness,
            drawerThickness
        );
        const frontSide = new THREE.Mesh(frontGeometry, drawerMaterial);
        frontSide.position.z = depth / 2 + drawerThickness / 2;
        drawerGroup.add(frontSide);

        // Handle
        const handleGeometry = new THREE.BoxGeometry(
            width * 0.3,
            drawerThickness,
            drawerThickness * 2
        );
        const handle = new THREE.Mesh(handleGeometry, drawerMaterial);
        handle.position.set(0, 0, depth / 2 + drawerThickness * 2);
        drawerGroup.add(handle);

        // Edges
        const frontEdges = new THREE.EdgesGeometry(frontGeometry);
        const bottomEdges = new THREE.EdgesGeometry(bottomGeometry);
        const leftEdges = new THREE.EdgesGeometry(leftGeometry);
        const rightEdges = new THREE.EdgesGeometry(rightGeometry);
        const backEdges = new THREE.EdgesGeometry(backGeometry);
        const handleEdges = new THREE.EdgesGeometry(handleGeometry);

        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
        });

        const frontLine = new THREE.LineSegments(frontEdges, lineMaterial);
        const bottomLine = new THREE.LineSegments(bottomEdges, lineMaterial);
        const leftLine = new THREE.LineSegments(leftEdges, lineMaterial);
        const rightLine = new THREE.LineSegments(rightEdges, lineMaterial);
        const backLine = new THREE.LineSegments(backEdges, lineMaterial);
        const handleLine = new THREE.LineSegments(handleEdges, lineMaterial);

        frontLine.position.copy(frontSide.position);
        bottomLine.position.copy(bottom.position);
        leftLine.position.copy(leftSide.position);
        rightLine.position.copy(rightSide.position);
        backLine.position.copy(backSide.position);
        handleLine.position.copy(handle.position);

        drawerGroup.add(
            frontLine,
            bottomLine,
            leftLine,
            rightLine,
            backLine,
            handleLine
        );
    };

    const exportSTL = () => {
        if (gridRef.current) {
            const exporter = new STLExporter();
            const stlString = exporter.parse(gridRef.current);
            const blob = new Blob([stlString], {
                type: 'application/octet-stream',
            });
            saveAs(blob, 'model.stl');
        }
    };

    return (
        <main className="h-[100vh] overflow-hidden bg-white">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={25}>
                    <Sidebar exportSTL={exportSTL} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                    <div ref={mountRef}></div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    );
}
