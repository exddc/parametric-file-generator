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

    console.log("GridMatrix: ", gridMatrix);
    let prevoiusWidth = 0;
    
    for (let i = 0; i < gridMatrix.length; i++) {
        let prevoiusDepth = 0;
        if (i > 0) {
        prevoiusWidth += gridMatrix[i - 1][0][0];
        for (let j = 0; j < gridMatrix[i].length; j++) {
                prevoiusDepth += gridMatrix[i][j][1];
                console.log(prevoiusWidth, prevoiusDepth);
                const verticalGeometry = new THREE.BoxGeometry(wallThickness, height, gridMatrix[i][0][1] - wallThickness);
                const verticalBar = new THREE.Mesh(verticalGeometry, new THREE.MeshStandardMaterial({ color: 0xC83535, roughness: 1, metalness: 1 }));
                verticalBar.position.x = prevoiusWidth;
                verticalBar.position.z = prevoiusDepth;
                gridGroup.add(verticalBar);

                console.log(verticalBar.position);

                const horizontalGeometry = new THREE.BoxGeometry(gridMatrix[i][0][0] - wallThickness, height, wallThickness);
                const horizontalBar = new THREE.Mesh(horizontalGeometry, material);
                horizontalBar.position.x = prevoiusDepth - gridMatrix[i][0][0] / 2;
                horizontalBar.position.z = prevoiusWidth + gridMatrix[i][0][1] / 2;
                gridGroup.add(horizontalBar);
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
