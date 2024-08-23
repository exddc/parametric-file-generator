import * as THREE from 'three';

export const createDrawerModel = (
    drawerGroup: THREE.Group,
    width: number,
    height: number,
    depth: number
) => {
    const drawerThickness = 5;
    const drawerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x967969, 
        roughness: 0.75, 
        metalness: 0 
    });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    const bottomGeometry = new THREE.BoxGeometry(
        depth + drawerThickness * 2,
        drawerThickness,
        width + drawerThickness
    );
    const bottom = new THREE.Mesh(bottomGeometry, drawerMaterial);
    bottom.position.y = -height / 2 - drawerThickness / 2;
    bottom.position.z = -drawerThickness / 2;
    drawerGroup.add(bottom);

    // Left side
    const leftGeometry = new THREE.BoxGeometry(
        drawerThickness,
        height,
        width
    );
    const leftSide = new THREE.Mesh(leftGeometry, drawerMaterial);
    leftSide.position.x = -depth / 2 - drawerThickness / 2;
    drawerGroup.add(leftSide);

    // Right side
    const rightGeometry = new THREE.BoxGeometry(
        drawerThickness,
        height,
        width
    );
    const rightSide = new THREE.Mesh(rightGeometry, drawerMaterial);
    rightSide.position.x = depth / 2 + drawerThickness / 2;
    drawerGroup.add(rightSide);

    // Back side
    const backGeometry = new THREE.BoxGeometry(
        depth + drawerThickness * 2,
        height,
        drawerThickness
    );
    const backSide = new THREE.Mesh(backGeometry, drawerMaterial);
    backSide.position.z = -width / 2 - drawerThickness / 2;
    drawerGroup.add(backSide);

    // Front side
    const frontGeometry = new THREE.BoxGeometry(
        depth + drawerThickness * 4,
        height + drawerThickness * 3,
        drawerThickness
    );
    const frontSide = new THREE.Mesh(frontGeometry, drawerMaterial);
    frontSide.position.z = width / 2 + drawerThickness / 2;
    drawerGroup.add(frontSide);

    // Handle
    const handleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        roughness: 0, 
        metalness: 0.75,  
    });
    const handleRadius = drawerThickness / 3;
    const handleLength = width * 0.4;
    const handleDepthOffset = drawerThickness * 2;

    const middleBarGeometry = new THREE.CylinderGeometry(
        handleRadius,
        handleRadius,
        handleLength,
        16
    );
    const middleBar = new THREE.Mesh(middleBarGeometry, handleMaterial);
    middleBar.rotation.z = Math.PI / 2;
    middleBar.position.set(0, 0, width / 2 + drawerThickness + handleDepthOffset);
    drawerGroup.add(middleBar);

    const leftBarGeometry = new THREE.CylinderGeometry(
        handleRadius,
        handleRadius,
        handleDepthOffset,
        16
    );
    const leftBar = new THREE.Mesh(leftBarGeometry, handleMaterial);
    leftBar.position.set(
        -handleLength / 2,
        0,
        width / 2 + handleDepthOffset / 2 + drawerThickness
    );
    leftBar.rotation.x = Math.PI / 2;
    drawerGroup.add(leftBar);

    const rightBarGeometry = new THREE.CylinderGeometry(
        handleRadius,
        handleRadius,
        handleDepthOffset,
        16
    );
    const rightBar = new THREE.Mesh(rightBarGeometry, handleMaterial);
    rightBar.position.set(
        handleLength / 2,
        0,
        width / 2 + handleDepthOffset / 2 + drawerThickness
    );
    rightBar.rotation.x = Math.PI / 2;
    drawerGroup.add(rightBar);

    const bendSphereGeometry = new THREE.SphereGeometry(
        handleRadius,
        16,
        16
    );

    const leftBend = new THREE.Mesh(bendSphereGeometry, handleMaterial);
    leftBend.position.set(
        -handleLength / 2,
        0,
        width / 2 + handleDepthOffset + drawerThickness
    );
    drawerGroup.add(leftBend);

    const rightBend = new THREE.Mesh(bendSphereGeometry, handleMaterial);
    rightBend.position.set(
        handleLength / 2,
        0,
        width / 2 + handleDepthOffset + drawerThickness
    );
    drawerGroup.add(rightBend);

    // Edges
    const frontEdges = new THREE.EdgesGeometry(frontGeometry);
    const bottomEdges = new THREE.EdgesGeometry(bottomGeometry);
    const leftEdges = new THREE.EdgesGeometry(leftGeometry);
    const rightEdges = new THREE.EdgesGeometry(rightGeometry);
    const backEdges = new THREE.EdgesGeometry(backGeometry);

    const frontLine = new THREE.LineSegments(frontEdges, lineMaterial);
    const bottomLine = new THREE.LineSegments(bottomEdges, lineMaterial);
    const leftLine = new THREE.LineSegments(leftEdges, lineMaterial);
    const rightLine = new THREE.LineSegments(rightEdges, lineMaterial);
    const backLine = new THREE.LineSegments(backEdges, lineMaterial);

    frontLine.position.copy(frontSide.position);
    bottomLine.position.copy(bottom.position);
    leftLine.position.copy(leftSide.position);
    rightLine.position.copy(rightSide.position);
    backLine.position.copy(backSide.position);

    drawerGroup.add(
        frontLine,
        bottomLine,
        leftLine,
        rightLine,
        backLine
    );

    drawerGroup.position.x = 0;
    drawerGroup.position.z = 0;
};
