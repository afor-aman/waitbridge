import { create } from 'zustand';

export type TabValue = 'edit' | 'analytics' | 'submissions' | 'share';
export type PreviewMode = 'desktop' | 'mobile';

interface DashboardState {
  activeTab: TabValue;
  previewMode: PreviewMode;
  setActiveTab: (tab: TabValue) => void;
  setPreviewMode: (mode: PreviewMode) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: 'edit',
  previewMode: 'desktop',
  setActiveTab: (tab) => set({ activeTab: tab }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
}));
