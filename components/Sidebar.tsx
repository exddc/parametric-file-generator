import { SketchPicker } from 'react-color';
import useStore from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createGridMatrix } from '@/lib/createGridMatrix';
import { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { Checkbox } from '@/components/ui/checkbox';

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
        showDrawer,
        generateOuterWalls,
    } = useStore();

    const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [sectionChangesOccured, setSectionChangesOccured] = useState(false);
    const [advancedSectionOpen, setAdvancedSectionOpen] = useState(false);

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
        if (colIndex != newGridMatrix[rowIndex].length - 1) {
            newGridMatrix[rowIndex][colIndex + 1][1] -= sectionChange;
        } else {
            newGridMatrix[rowIndex][colIndex - 1][1] -= sectionChange;
        }

        setParams({ gridMatrix: newGridMatrix });
        setSectionChangesOccured(true);
    };

    const resetModel = () => {
        updateGridMatrix(xSections, ySections);
        setSectionChangesOccured(false);
    };

    return (
        <div className="col-span-1 pt-5 pl-5 overflow-auto">
            <h1 className="font-bold text-lg">
                Parametric Drawer Inserts Generator
            </h1>
            <p className="text-sm max-w-[75%]">
                Adjust the drawer dimensions and grid spacing using the sliders.
                Click the download button to export the STL file.
            </p>
            <ScrollArea className="h-[90vh] pr-5">
                <div className="grid grid-cols-1 gap-2 mt-8 pb-8">
                    <h2 className="font-bold">General Parameters</h2>

                    <div className="grid grid-cols-1 gap-5">
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
                            <Label htmlFor="xSections">
                                Width-Sections: {xSections}
                            </Label>
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
                            <Label htmlFor="ySections">
                                Depth-Sections: {ySections}
                            </Label>
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
                        <div className="flex flex-row justify-between">
                            <Label htmlFor="showDrawer">
                                Show Drawer in Model
                            </Label>
                            <Checkbox
                                id="showDrawer"
                                className="ml-auto"
                                checked={showDrawer}
                                onCheckedChange={() => {
                                    setParams({ showDrawer: !showDrawer });
                                }}
                            />
                        </div>
                        <div className="flex flex-row justify-between">
                            <Label htmlFor="generateOuterWalls">
                                Generate Outer Walls
                            </Label>
                            <Checkbox
                                id="generateOuterWalls"
                                className="ml-auto"
                                checked={generateOuterWalls}
                                onCheckedChange={() => {
                                    setParams({
                                        generateOuterWalls: !generateOuterWalls,
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <Collapsible
                        open={advancedSectionOpen}
                        onOpenChange={setAdvancedSectionOpen}
                        className="grid grid-cols-1 gap-2 mt-8"
                    >
                        <CollapsibleTrigger className="font-bold text-left justify-between flex items-center">
                            <span>Advanced Parameters</span>
                            {advancedSectionOpen ? (
                                <ChevronUpIcon />
                            ) : (
                                <ChevronDownIcon />
                            )}
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="grid grid-cols-1 gap-2 mt-2">
                                <Label htmlFor="columnSelector">
                                    Select Column
                                </Label>
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
                                    {Array.from(
                                        { length: ySections },
                                        (_, index) => (
                                            <option key={index} value={index}>
                                                Column {index + 1}
                                            </option>
                                        )
                                    )}
                                </select>

                                {selectedColumn !== null ? (
                                    <div className="">
                                        <Label>
                                            Adjust Sections in Column{' '}
                                            {selectedColumn + 1}:
                                        </Label>
                                        {gridMatrix[selectedColumn].map(
                                            (section, colIndex) => (
                                                <div
                                                    key={colIndex}
                                                    className="mt-2"
                                                >
                                                    <Label>
                                                        Section {colIndex + 1}:{' '}
                                                        {section[1].toFixed(2)}{' '}
                                                        mm
                                                    </Label>
                                                    <Slider
                                                        value={[section[1]]}
                                                        max={depth}
                                                        min={1}
                                                        step={1}
                                                        onValueChange={(
                                                            value
                                                        ) =>
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
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="hidden"></div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-2 mt-2">
                                <Label>Color</Label>
                                <SketchPicker
                                    color={color}
                                    onChangeComplete={(color) =>
                                        setParams({ color: color.hex })
                                    }
                                    className="mx-auto"
                                />
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                    <div className="mt-8 grid grid-cols-1 gap-3">
                        {sectionChangesOccured && (
                            <Button
                                variant={'destructive'}
                                onClick={resetModel}
                            >
                                Reset Model
                            </Button>
                        )}
                        <Button onClick={exportSTL}>Download STL</Button>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default Sidebar;
