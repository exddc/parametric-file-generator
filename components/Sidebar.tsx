import { SketchPicker } from 'react-color';
import useStore from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createGridMatrix } from '@/lib/createGridMatrix';
import { useState } from 'react';

const Sidebar = ({ exportSTL }: { exportSTL: () => void }) => {
    const {
        width,
        height,
        depth,
        xSections,
        ySections,
        wallThickness,
        color,
        setParams,
        gridMatrix,
    } = useStore();

    const [selectedColumn, setSelectedColumn] = useState<number | null>(null);

    const updateGridMatrix = (newXSections: number, newYSections: number) => {
        const newGridMatrix = createGridMatrix(
            newXSections,
            newYSections,
            width,
            depth
        );
        setParams({ gridMatrix: newGridMatrix });
    };

    const handleSectionLengthChange = (
        rowIndex: number,
        colIndex: number,
        value: number
    ) => {
        const newGridMatrix = [...gridMatrix];

        let sectionChange = value - newGridMatrix[rowIndex][colIndex][1];

        newGridMatrix[rowIndex][colIndex][1] = value;
        newGridMatrix[rowIndex][colIndex + 1][1] -= sectionChange;

        setParams({ gridMatrix: newGridMatrix });
    };

    return (
        <div className="col-span-1 p-5 overflow-auto">
            <h1 className="font-bold text-lg">
                Parametric Drawer Inserts Generator
            </h1>
            <p className="text-sm max-w-[75%]">
                Adjust the drawer dimensions and grid spacing using the sliders.
                Click the download button to export the STL file.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-5">
                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="width">Width: {width} mm</Label>
                    <Slider
                        id="width"
                        value={[width]}
                        max={500}
                        min={2}
                        step={1}
                        onValueChange={(value) => {
                            setParams({ width: value[0] });
                            updateGridMatrix(xSections, ySections);
                        }}
                    />
                    <div className="flex justify-between text-xs">
                        <span>1 mm</span>
                        <span>500 mm</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="depth">Depth: {depth} mm</Label>
                    <Slider
                        id="depth"
                        value={[depth]}
                        max={500}
                        min={2}
                        step={1}
                        onValueChange={(value) => {
                            setParams({ depth: value[0] });
                            updateGridMatrix(xSections, ySections);
                        }}
                    />
                    <div className="flex justify-between text-xs">
                        <span>1 mm</span>
                        <span>500 mm</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="height">Height: {height} mm</Label>
                    <Slider
                        id="height"
                        value={[height]}
                        max={500}
                        min={2}
                        step={1}
                        onValueChange={(value) =>
                            setParams({ height: value[0] })
                        }
                    />
                    <div className="flex justify-between text-xs">
                        <span>1 mm</span>
                        <span>500 mm</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="wallThickness">
                        Wall Thickness: {wallThickness} mm
                    </Label>
                    <Slider
                        id="wallThickness"
                        value={[wallThickness]}
                        max={5}
                        min={0.4}
                        step={0.1}
                        onValueChange={(value) =>
                            setParams({ wallThickness: value[0] })
                        }
                    />
                    <div className="flex justify-between text-xs">
                        <span>0.4 mm</span>
                        <span>5 mm</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="xSections">X-Sections: {xSections}</Label>
                    <Slider
                        id="xSections"
                        value={[xSections]}
                        max={10}
                        min={2}
                        step={1}
                        onValueChange={(value) => {
                            setParams({ xSections: value[0] });
                            updateGridMatrix(value[0], ySections);
                        }}
                    />
                    <div className="flex justify-between text-xs">
                        <span>2</span>
                        <span>10</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="ySections">Y-Sections: {ySections}</Label>
                    <Slider
                        id="ySections"
                        value={[ySections]}
                        max={10}
                        min={2}
                        step={1}
                        onValueChange={(value) => {
                            setParams({ ySections: value[0] });
                            updateGridMatrix(xSections, value[0]);
                        }}
                    />
                    <div className="flex justify-between text-xs">
                        <span>2</span>
                        <span>10</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="columnSelector">Select Column</Label>
                    <select
                        id="columnSelector"
                        value={selectedColumn ?? ''}
                        onChange={(e) =>
                            setSelectedColumn(
                                e.target.value !== ''
                                    ? Number(e.target.value)
                                    : null
                            )
                        }
                    >
                        <option value="">None</option>
                        {Array.from({ length: ySections }, (_, index) => (
                            <option key={index} value={index}>
                                Column {index + 1}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedColumn !== null && (
                    <div className="mt-4">
                        <Label>
                            Adjust Sections in Column {selectedColumn + 1}:
                        </Label>
                        {gridMatrix[selectedColumn].map((section, colIndex) => (
                            <div key={colIndex} className="mt-2">
                                <Label>
                                    Section {colIndex + 1}:{' '}
                                    {section[1].toFixed(2)} mm
                                </Label>
                                <Slider
                                    value={[section[1]]}
                                    max={depth}
                                    min={1}
                                    step={1}
                                    onValueChange={(value) =>
                                        handleSectionLengthChange(
                                            selectedColumn,
                                            colIndex,
                                            value[0]
                                        )
                                    }
                                />
                                <div className="flex justify-between text-xs">
                                    <span>1 mm</span>
                                    <span>{depth} mm</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div>
                    <Label className="block mb-2">Color</Label>
                    <SketchPicker
                        color={color}
                        onChangeComplete={(color) =>
                            setParams({ color: color.hex })
                        }
                        className="mx-auto"
                    />
                </div>
                <Button onClick={exportSTL}>Download STL</Button>
            </div>
        </div>
    );
};

export default Sidebar;
