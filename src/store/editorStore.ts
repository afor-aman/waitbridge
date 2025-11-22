import { create } from 'zustand';

export interface EditorState {
  headerText: string;
  subText: string;
  submissionMessage: string;
  bgColor: string;
  textColor: string;
  logo: string | null;
  font: string;
  layout: 'center' | 'left' | 'right';
  bgType: 'solid' | 'gradient' | 'image';
  bgGradient: string;
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
}

export const INITIAL_STATE: EditorState = {
  headerText: 'Join the Waitlist',
  subText: 'Sign up to be the first to know when we launch. We are building something amazing.',
  submissionMessage: "You're on the list! We'll be in touch soon.",
  bgColor: '#ffffff',
  textColor: '#000000',
  logo: null,
  font: 'inter',
  layout: 'center',
  bgType: 'solid',
  bgGradient: 'from-blue-500 to-purple-600',
  buttonStyle: 'pill',
  buttonText: 'Join',
  buttonColor: '#000000',
  buttonTextColor: '#ffffff',
  inputColor: '#ffffff',
  inputPlaceholderColor: '#999999',
  inputPlaceholder: 'Enter your email',
};

export const useEditorStore = create<EditorStore>((set) => ({
  ...INITIAL_STATE,
  updateState: (key, value) => set((state) => ({ ...state, [key]: value })),
  setFullState: (newState) => set(() => ({ ...newState })),
}));
