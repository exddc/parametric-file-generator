import * as THREE from 'three';

export const createGridModel = (
    gridGroup: THREE.Group,
    width: number,
    height: number,
    depth: number,
    xSections: number,
    ySections: number,
    wallThickness: number,
    color: string,
    gridMatrix: [number, number][][],
    generateOuterWalls: boolean
) => {
    const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 1,
        metalness: 1,
    });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x606060 });

    const createBar = (thickness: number, length: number, height: number, positionX: number, positionY: number, rotation: number, material_type: THREE.MeshStandardMaterial) => {
        const geometry = new THREE.BoxGeometry(thickness, height, length);
        const mesh = new THREE.Mesh(geometry, material_type);
        mesh.position.x = positionX;
        mesh.position.z = positionY;
        mesh.rotation.y = rotation;
        return mesh;
    }

    const createEdge = (thickness: number, length: number, height: number, positionX: number, positionY: number, rotation: number, material_type: THREE.LineBasicMaterial) => {
        const geometry = new THREE.BoxGeometry(thickness, height, length);
        const mesh = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), material_type);
        mesh.position.x = positionX;
        mesh.position.z = positionY;
        mesh.rotation.y = rotation;
        return mesh;
    }

    // Create outside walls
    if(generateOuterWalls){
        gridGroup.add(createBar(wallThickness, depth, height, -width / 2  + wallThickness / 2, 0, 0, material));
        gridGroup.add(createBar(wallThickness, depth, height, width / 2 - wallThickness / 2, 0, 0, material));
        gridGroup.add(createBar(width, wallThickness, height, 0, -depth/2 + wallThickness / 2, 0, material));
        gridGroup.add(createBar(width, wallThickness, height, 0, depth/2 - wallThickness / 2, 0, material));

        gridGroup.add(createEdge(wallThickness, depth, height, -width / 2 + wallThickness / 2, 0, 0, lineMaterial));
        gridGroup.add(createEdge(wallThickness, depth, height, width / 2 - wallThickness / 2, 0, 0, lineMaterial));
        gridGroup.add(createEdge(width, wallThickness, height, 0, -depth/2 + wallThickness / 2, 0, lineMaterial));
        gridGroup.add(createEdge(width, wallThickness, height, 0, depth/2 - wallThickness / 2, 0, lineMaterial));
    }

    // Create inside walls
    let previousSectionsTotalWidth = 0;
    for (let i = 0; i < gridMatrix.length; i++) {
        
        for (let j = 0; j < gridMatrix[i].length; j++) {
            const [sectionWidth, sectionDepth] = gridMatrix[i][j];

            // Get the total depth of the previous sections the same column
            let previousSectionsTotalDepth = 0;
            for(let k = 0; k < j; k++){
                previousSectionsTotalDepth += gridMatrix[i][k][1];
            }

            // Create depth bars
            if (i < gridMatrix.length - 1) {
                gridGroup.add(createBar(wallThickness, sectionDepth, height, width / 2 - sectionWidth - previousSectionsTotalWidth, depth/2 - sectionDepth / 2 - previousSectionsTotalDepth, 0, material));
                gridGroup.add(createEdge(wallThickness, sectionDepth, height, width / 2 - sectionWidth - previousSectionsTotalWidth, depth/2 - sectionDepth / 2 - previousSectionsTotalDepth, 0, lineMaterial));
            }

            // Create width bars
            if (j < gridMatrix[i].length - 1) {
                gridGroup.add(createBar(sectionWidth, wallThickness, height, width / 2 - sectionWidth / 2 - previousSectionsTotalWidth, depth / 2 - sectionDepth - previousSectionsTotalDepth, 0, material));
                gridGroup.add(createEdge(sectionWidth, wallThickness, height, width / 2 - sectionWidth / 2 - previousSectionsTotalWidth, depth / 2 - sectionDepth - previousSectionsTotalDepth , 0, lineMaterial));
            }
        }
        previousSectionsTotalWidth += gridMatrix[i][0][0];
    }
};
