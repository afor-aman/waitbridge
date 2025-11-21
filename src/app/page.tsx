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
  font: 'sans' | 'serif' | 'mono';
  layout: 'center' | 'left' | 'right';
  bgType: 'solid' | 'gradient' | 'image';
  bgGradient: string;
  buttonStyle: 'rounded' | 'pill' | 'sharp';
}

const INITIAL_STATE: EditorState = {
  headerText: 'Join the Waitlist',
  subText: 'Sign up to be the first to know when we launch. We are building something amazing.',
  submissionMessage: "You're on the list! We'll be in touch soon.",
  bgColor: '#ffffff',
  textColor: '#000000',
  logo: null,
  font: 'sans',
  layout: 'center',
  bgType: 'solid',
  bgGradient: 'from-blue-500 to-purple-600',
  buttonStyle: 'pill',
};

export default function Home() {
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
