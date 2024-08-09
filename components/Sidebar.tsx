import { SketchPicker } from 'react-color';
import useStore from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

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
    } = useStore();

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
                        onValueChange={(value) =>
                            setParams({ width: value[0] })
                        }
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
                        onValueChange={(value) =>
                            setParams({ depth: value[0] })
                        }
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
                        onValueChange={(value) =>
                            setParams({ xSections: value[0] })
                        }
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
                        onValueChange={(value) =>
                            setParams({ ySections: value[0] })
                        }
                    />
                    <div className="flex justify-between text-xs">
                        <span>2</span>
                        <span>10</span>
                    </div>
                </div>
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
