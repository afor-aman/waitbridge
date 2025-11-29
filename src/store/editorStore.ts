import { create } from 'zustand';

export interface EditorState {
  headerText: string;
  subText: string;
  submissionMessage: string;
  bgColor: string;
  textColor: string;
  subTextColor: string;
  logo: string | null;
  font: string;
  layout: 'center' | 'left' | 'right';
  layoutType: 'simple' | 'split';
  textPosition: 'left' | 'right' | 'top';
  showSocialProof: boolean;
  nameField: boolean;
  bgType: 'solid' | 'gradient' | 'pattern' | 'image';
  bgGradient: string;
  bgPattern: string;
  bgPatternColor: string;
  bgPatternOpacity: number;
  bgImage: string | null;
  buttonStyle: 'rounded' | 'pill' | 'sharp';
  buttonText: string;
  buttonColor: string;
  buttonTextColor: string;
  inputColor: string;
  inputPlaceholderColor: string;
  inputPlaceholder: string;
}

interface EditorStore extends EditorState {
  updateState: (key: keyof EditorState, value: any) => void;
  setFullState: (state: EditorState) => void;
  getState: () => EditorState;
}

export const INITIAL_STATE: EditorState = {
  headerText: 'Join the Waitlist',
  subText: 'Sign up to be the first to know when we launch. We are building something amazing.',
  submissionMessage: "You're on the list! We'll be in touch soon.",
  bgColor: '#ffffff',
  textColor: '#000000',
  subTextColor: '#000000',
  logo: null,
  font: 'inter',
  layout: 'center',
  layoutType: 'simple',
  textPosition: 'left',
  showSocialProof: true,
  nameField: false,
  bgType: 'solid',
  bgGradient: 'from-blue-500 to-purple-600',
  bgPattern: 'dots',
  bgPatternColor: '#000000',
  bgPatternOpacity: 0.1,
  bgImage: null,
  buttonStyle: 'pill',
  buttonText: 'Join',
  buttonColor: '#000000',
  buttonTextColor: '#ffffff',
  inputColor: '#ffffff',
  inputPlaceholderColor: '#999999',
  inputPlaceholder: 'Enter your email',
};


export const useEditorStore = create<EditorStore>((set, get) => ({
  ...INITIAL_STATE,
  updateState: (key, value) => set((state) => ({ ...state, [key]: value })),
  setFullState: (newState) => set(() => ({ 
    ...INITIAL_STATE, // Start with defaults for any missing fields
    ...newState, // Override with loaded state
    updateState: get().updateState, 
    setFullState: get().setFullState, 
    getState: get().getState 
  })),
  getState: () => {
    const state = get();
    const { updateState, setFullState, getState, ...editorState } = state;
    return editorState as EditorState;
  },
}));
