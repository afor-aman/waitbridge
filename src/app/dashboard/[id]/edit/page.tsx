"use client";

import React, { useState } from 'react';
import { EditorLayout } from '@/components/editor/EditorLayout';
import { ControlsPanel } from '@/components/editor/ControlsPanel';
import { PreviewPanel } from '@/components/editor/PreviewPanel';

interface EditorState {
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

const INITIAL_STATE: EditorState = {
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

export default function Edit() {
  const [state, setState] = useState<EditorState>(INITIAL_STATE);

  const handleChange = (key: keyof EditorState, value: string | null) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <EditorLayout
      controls={<ControlsPanel state={state} onChange={handleChange} />}
    >
      <PreviewPanel state={state} />
    </EditorLayout>
  );
}
