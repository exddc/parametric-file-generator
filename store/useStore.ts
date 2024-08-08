import {create} from 'zustand';

interface DrawerParams {
  width: number;
  height: number;
  depth: number;
  xSections: number;
  ySections: number;
  wallThickness: number;
  color: string;
  setParams: (params: Partial<DrawerParams>) => void;
}

const useStore = create<DrawerParams>((set) => ({
  width: 100,
  height: 10,
  depth: 100,
  xSections: 2,
  ySections: 2,
  wallThickness: 1,
  color: '#000000',
  setParams: (params) => set((state) => ({ ...state, ...params })),
}));

export default useStore;
