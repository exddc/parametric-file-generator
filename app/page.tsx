'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { saveAs } from 'file-saver';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import { SketchPicker } from 'react-color';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';

export default function Home() {
    const mountRef = useRef(null);
    const [params, setParams] = useState({
        width: 100,
        height: 10,
        depth: 100,
        xSections: 2,
        ySections: 2,
        color: '#000000',
    });
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

            const sectionWidth = params.width / (params.xSections + 1);
            const sectionDepth = params.depth / (params.ySections + 1);
            const barThickness = 5; // TODO: Make this a parameter

            // X-axis
            for (let i = 1; i <= params.xSections; i++) {
                const geometry = new THREE.BoxGeometry(
                    barThickness,
                    params.height,
                    params.depth
                );
                const material = new THREE.MeshBasicMaterial({
                    color: params.color,
                });
                const bar = new THREE.Mesh(geometry, material);
                bar.position.x = -params.width / 2 + i * sectionWidth;
                gridRef.current.add(bar);

                const edges = new THREE.EdgesGeometry(geometry);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0xffffff, // TODO: Dependent of model color and background color
                });
                const line = new THREE.LineSegments(edges, lineMaterial);
                line.position.copy(bar.position);
                gridRef.current.add(line);
            }

            // Y-axis
            for (let j = 1; j <= params.ySections; j++) {
                const geometry = new THREE.BoxGeometry(
                    params.width,
                    params.height,
                    barThickness
                );
                const material = new THREE.MeshBasicMaterial({
                    color: params.color,
                });
                const bar = new THREE.Mesh(geometry, material);
                bar.position.z = -params.depth / 2 + j * sectionDepth;
                gridRef.current.add(bar);

                const edges = new THREE.EdgesGeometry(geometry);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                });
                const line = new THREE.LineSegments(edges, lineMaterial);
                line.position.copy(bar.position);
                gridRef.current.add(line);
            }
        }
    }, [params]);

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
                    <div className="col-span-1 p-5 overflow-auto">
                        <h1>3D Drawer Layout Generator</h1>
                        <p>
                            Adjust the drawer dimensions and grid spacing using
                            the sliders.
                        </p>
                        <div className="mt-5 grid grid-cols-1 gap-5">
                            <div className="grid grid-cols-1 gap-2">
                                <Label htmlFor="width">
                                    Width: {params.width} mm
                                </Label>
                                <Slider
                                    id="width"
                                    value={[params.width]}
                                    max={500}
                                    min={2}
                                    step={1}
                                    onValueChange={(value) => {
                                        setParams({
                                            ...params,
                                            width: value[0],
                                        });
                                    }}
                                />

                                <div className="flex justify-between text-xs">
                                    <span>1 mm</span>
                                    <span>500 mm</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <Label htmlFor="depth">
                                    Depth: {params.depth} mm
                                </Label>
                                <Slider
                                    id="depth"
                                    value={[params.depth]}
                                    max={500}
                                    min={2}
                                    step={1}
                                    onValueChange={(value) => {
                                        setParams({
                                            ...params,
                                            depth: value[0],
                                        });
                                    }}
                                />

                                <div className="flex justify-between text-xs">
                                    <span>1 mm</span>
                                    <span>500 mm</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <Label htmlFor="height">
                                    Height: {params.height} mm
                                </Label>
                                <Slider
                                    id="height"
                                    value={[params.height]}
                                    max={500}
                                    min={2}
                                    step={1}
                                    onValueChange={(value) => {
                                        setParams({
                                            ...params,
                                            height: value[0],
                                        });
                                    }}
                                />

                                <div className="flex justify-between text-xs">
                                    <span>1 mm</span>
                                    <span>500 mm</span>
                                </div>
                            </div>

                            <p>Layout</p>

                            <div className="grid grid-cols-1 gap-2">
                                <Label htmlFor="xSections">
                                    X-Sections: {params.xSections}
                                </Label>
                                <Slider
                                    id="xSections"
                                    value={[params.xSections]}
                                    max={10}
                                    min={2}
                                    step={1}
                                    onValueChange={(value) => {
                                        setParams({
                                            ...params,
                                            xSections: value[0],
                                        });
                                    }}
                                />

                                <div className="flex justify-between text-xs">
                                    <span>2</span>
                                    <span>10</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <Label htmlFor="ySections">
                                    Y-Sections: {params.ySections}
                                </Label>
                                <Slider
                                    id="ySections"
                                    value={[params.ySections]}
                                    max={10}
                                    min={2}
                                    step={1}
                                    onValueChange={(value) => {
                                        setParams({
                                            ...params,
                                            ySections: value[0],
                                        });
                                    }}
                                />

                                <div className="flex justify-between text-xs">
                                    <span>2</span>
                                    <span>10</span>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2">Color</label>
                                <SketchPicker
                                    color={params.color}
                                    onChangeComplete={(color) =>
                                        setParams({
                                            ...params,
                                            color: color.hex,
                                        })
                                    }
                                    className="mx-auto"
                                />
                            </div>

                            <Button onClick={exportSTL}>Download STL</Button>
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                    <div ref={mountRef}></div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    );
}
