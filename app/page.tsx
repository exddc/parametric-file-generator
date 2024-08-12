'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { saveAs } from 'file-saver';
// @ts-ignore
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';

import Sidebar from '@/components/Sidebar';
import ModelView from '@/components/ModelView';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';

export default function Home() {
    const gridRef = useRef<THREE.Group>(new THREE.Group());

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
                <ResizablePanel defaultSize={75}>
                    <ModelView gridRef={gridRef} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    );
}
