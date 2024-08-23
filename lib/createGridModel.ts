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
    gridMatrix: [number, number][][]
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
    gridGroup.add(createBar(wallThickness, width + wallThickness, height, -depth / 2, 0, 0, material));
    gridGroup.add(createBar(wallThickness, width + wallThickness, height, depth / 2, 0, 0, material));
    gridGroup.add(createBar(depth + wallThickness, wallThickness, height, 0, -width/2, 0, material));
    gridGroup.add(createBar(depth + wallThickness, wallThickness, height, 0, width/2, 0, material));

    gridGroup.add(createEdge(wallThickness, width + wallThickness, height, -depth / 2, 0, 0, lineMaterial));
    gridGroup.add(createEdge(wallThickness, width + wallThickness, height, depth / 2, 0, 0, lineMaterial));
    gridGroup.add(createEdge(depth + wallThickness, wallThickness, height, 0, -width/2, 0, lineMaterial));
    gridGroup.add(createEdge(depth + wallThickness, wallThickness, height, 0, width/2, 0, lineMaterial));

    // Create inside walls
    for (let i = 0; i < gridMatrix.length; i++) {
        let previousSectionsTotalWidth = 0;
        for (let j = 0; j < gridMatrix[i].length; j++) {
            const [sectionDepth, sectionWidth] = gridMatrix[i][j];
            
            // Get the total depth of the previous sections the same column
            let previousSectionsTotalDepth = 0;
            for(let k = 0; k < i; k++){
                previousSectionsTotalDepth += gridMatrix[k][j][0];
            }

            previousSectionsTotalWidth += sectionWidth;

            // Center the grid
            let depthOffset = depth / 2 - previousSectionsTotalDepth;
            let widthOffset = width / 2 - previousSectionsTotalWidth;

            // Create depth bars (X-axis)
            if(j < gridMatrix[i].length - 1){
                gridGroup.add(createBar(sectionDepth, wallThickness, height, depthOffset - sectionDepth/2, widthOffset, 0, material));
                gridGroup.add(createEdge(sectionDepth, wallThickness, height, depthOffset - sectionDepth/2, widthOffset, 0, lineMaterial));
            }

            // Create width bars (Z-axis)
            if(i > 0){
                gridGroup.add(createBar(wallThickness, sectionWidth, height, depthOffset, widthOffset + sectionWidth/2, 0, material));
                gridGroup.add(createEdge(wallThickness, sectionWidth, height, depthOffset, widthOffset + sectionWidth/2, 0, lineMaterial));
            }
        }
    }
};
