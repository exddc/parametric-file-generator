import * as THREE from 'three';

export const createGridModel = (
    gridGroup: THREE.Group,
    width: number,
    height: number,
    depth: number,
    xSections: number,
    ySections: number,
    wallThickness: number,
    color: string
) => {
    const sectionWidth = width / xSections;
    const sectionDepth = depth / ySections;

    for (let i = 1; i < xSections; i++) {
        const geometry = new THREE.BoxGeometry(wallThickness, height, depth);
        const material = new THREE.MeshBasicMaterial({ color });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.x = -width / 2 + i * sectionWidth;
        gridGroup.add(bar);

        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.LineSegments(edges, lineMaterial);
        line.position.copy(bar.position);
        gridGroup.add(line);
    }

    for (let j = 1; j < ySections; j++) {
        const geometry = new THREE.BoxGeometry(width, height, wallThickness);
        const material = new THREE.MeshBasicMaterial({ color });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.z = -depth / 2 + j * sectionDepth;
        gridGroup.add(bar);

        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.LineSegments(edges, lineMaterial);
        line.position.copy(bar.position);
        gridGroup.add(line);
    }
};
