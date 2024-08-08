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

    useEffect(() => {
        const scene = new THREE.Scene();
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
        if (gridRef.current) {
            gridRef.current.clear();

            const sectionWidth = width / (xSections + 1);
            const sectionDepth = depth / (ySections + 1);

            // Create vertical bars
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

                // Add edges
                const edges = new THREE.EdgesGeometry(geometry);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                });
                const line = new THREE.LineSegments(edges, lineMaterial);
                line.position.copy(bar.position);
                gridRef.current.add(line);
            }

            // Create horizontal bars
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

                // Add edges
                const edges = new THREE.EdgesGeometry(geometry);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                });
                const line = new THREE.LineSegments(edges, lineMaterial);
                line.position.copy(bar.position);
                gridRef.current.add(line);
            }
        }
    }, [width, height, depth, xSections, ySections, wallThickness, color]);

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
