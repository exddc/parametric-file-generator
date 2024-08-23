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
    const material_red = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 1,
        metalness: 1,
    });
    const material_green = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        roughness: 1,
        metalness: 1,
    });
    const material_blue = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
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

    // Create outside walls
    gridGroup.add(createBar(wallThickness, width + wallThickness, height, -depth / 2, 0, 0, material_red));
    gridGroup.add(createBar(wallThickness, width + wallThickness, height, depth / 2, 0, 0, material_red));
    gridGroup.add(createBar(depth + wallThickness, wallThickness, height, 0, -width/2, 0, material_blue));
    gridGroup.add(createBar(depth + wallThickness, wallThickness, height, 0, width/2, 0, material_blue));

    // Create inside walls
    for (let i = 0; i < gridMatrix.length; i++) {
        let previousSectionsTotalWidth = 0;
        for (let j = 0; j < gridMatrix[i].length; j++) {
            const [sectionDepth, sectionWidth] = gridMatrix[i][j];
            console.log("i: " + i + " j: " + j + " sectionWidth: " + sectionWidth + " sectionDepth: " + sectionDepth);
            
            // Get the total depth of the previous sections the same column
            let previousSectionsTotalDepth = 0;
            for(let k = 0; k < i; k++){
                previousSectionsTotalDepth += gridMatrix[k][j][0];
            }
            console.log(previousSectionsTotalDepth);

            previousSectionsTotalWidth += sectionWidth;

            // Center the grid
            let depthOffset = depth / 2 - previousSectionsTotalDepth;
            let widthOffset = width / 2 - previousSectionsTotalWidth;

            console.log("depthOffset: " + depthOffset + " widthOffset: " + widthOffset);

            // Create depth bars (X-axis)
            if(j < gridMatrix[i].length - 1){
                gridGroup.add(createBar(sectionDepth, wallThickness, height, depthOffset - sectionDepth/2, widthOffset, 0, material_green));
            }

            // Create width bars (Z-axis)
            if(i > 0){
                gridGroup.add(createBar(wallThickness, sectionWidth, height, depthOffset, widthOffset + sectionWidth/2, 0, material));
            }
        }
    }





    

    

    

    /* for (let i = 0; i < gridMatrix.length; i++) {
        for (let j = 0; j < gridMatrix[i].length; j++) {
            const [sectionWidth, sectionDepth] = gridMatrix[i][j];

            if(i > 0){
                // Create vertical bars (X-axis)
                const verticalGeometry = new THREE.BoxGeometry(wallThickness, height, sectionDepth - wallThickness);
                const verticalBar = new THREE.Mesh(verticalGeometry, material);
                verticalBar.position.x = sectionWidth * i;
                verticalBar.position.z = sectionDepth * j + sectionDepth / 2;
                gridGroup.add(verticalBar);

                const verticalEdges = new THREE.EdgesGeometry(verticalGeometry);
                const verticalLine = new THREE.LineSegments(verticalEdges, lineMaterial);
                verticalLine.position.copy(verticalBar.position);
                gridGroup.add(verticalLine);
            }
            

            if(j < gridMatrix[i].length - 1){
                // Create horizontal bars (Z-axis)
                const horizontalGeometry = new THREE.BoxGeometry(sectionWidth - wallThickness, height, wallThickness);
                const horizontalBar = new THREE.Mesh(horizontalGeometry, material);
                horizontalBar.position.x = sectionWidth / 2 + sectionWidth * i;
                horizontalBar.position.z = sectionDepth / 2 + sectionDepth * j  + sectionDepth / 2;
                gridGroup.add(horizontalBar);
            }
        }
    }

    gridGroup.position.x = -width / 2;
    gridGroup.position.z = -depth / 2; */
};
