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
    type SectionLength = [number, number];
    type GridMatrix = SectionLength[][];

    let matrix: GridMatrix = [];

    for (let i = 0; i < xSections; i++) {
        let row: SectionLength[] = [];
        for (let j = 0; j < ySections; j++) {
            let x = width / xSections;
            let y = depth / ySections;
            row.push([x, y]);
        }
        matrix.push(row);
    }

    console.log(matrix);



    const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 1,
        metalness: 1,
    });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x606060 });


    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            const [sectionWidth, sectionDepth] = matrix[i][j];

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
            

            if(j < matrix[i].length - 1){
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
    gridGroup.position.z = -depth / 2;
};
