export function createGridMatrix(
    xSections: number,
    ySections: number,
    width: number,
    depth: number
) {
    type SectionLength = [number, number];
    type GridMatrix = SectionLength[][];

    const matrix: GridMatrix = [];

    for (let i = 0; i < xSections; i++) {
        const row: SectionLength[] = [];
        for (let j = 0; j < ySections; j++) {
            const x = width / xSections;
            const y = depth / ySections;
            row.push([x, y]);
        }
        matrix.push(row);
    }

    return matrix;
}